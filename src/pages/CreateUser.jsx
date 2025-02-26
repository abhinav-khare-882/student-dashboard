import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { FaUpload } from "react-icons/fa";

const CreateUser = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const subjectOptions = [
    { value: "Math", label: "Math" },
    { value: "Science", label: "Science" },
    { value: "History", label: "History" },
    { value: "English", label: "English" },
    { value: "Computer Science", label: "Computer Science" },
  ];

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    studentID: Yup.string().required("Student ID is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    address: Yup.string().required("Address is required"),
    subjects: Yup.array().min(1, "At least one subject must be selected"),
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Form Data Before Sending:", values);

      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("studentID", values.studentID);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("image", values.image);

      // ✅ Convert subjects to an array of values
      formData.append(
        "subjects",
        JSON.stringify(values.subjects.map((subject) => subject.value))
      );

      const response = await axios.post(
        "http://localhost:5000/students",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Student created:", response.data);
      alert("Student added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Student</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          studentID: "",
          email: "",
          phone: "",
          address: "",
          image: null,
          subjects: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            {[
              "firstName",
              "lastName",
              "studentID",
              "email",
              "phone",
              "address",
            ].map((field) => (
              <div key={field}>
                <label className="block font-semibold capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <Field name={field} type="text" className="w-full border p-2" />
                <ErrorMessage
                  name={field}
                  component="div"
                  className="text-red-500"
                />
              </div>
            ))}

            <div>
              <label className="block font-semibold">Subjects</label>
              <Select
                isMulti
                name="subjects"
                options={subjectOptions}
                value={values.subjects}
                onChange={(selected) => setFieldValue("subjects", selected)}
                className="w-full border rounded"
              />
              <ErrorMessage
                name="subjects"
                component="div"
                className="text-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Upload Student Image
              </label>
              <div
                className="flex items-center space-x-4 border p-3 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
                onClick={() => fileInputRef.current.click()}
              >
                <FaUpload className="text-blue-500 text-xl" />
                <span className="text-gray-700">Choose File</span>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(event) =>
                  setFieldValue("image", event.currentTarget.files[0])
                }
              />
              {values.image && (
                <img
                  src={URL.createObjectURL(values.image)}
                  alt="Preview"
                  className="mt-2 w-24 h-24 rounded-lg object-cover"
                />
              )}
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Student
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUser;
