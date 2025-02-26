import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentID: "",
    email: "",
    phone: "",
    address: "",
    image: "",
    subjects: [],
  });

  useEffect(() => {
    axios
      .get(`https://student-dashboard-server.vercel.app/students/${id}`)
      .then((res) => {
        setFormData({
          ...res.data,
          subjects:
            res.data.subjects.map((subject) => ({
              label: subject,
              value: subject,
            })) || [],
        });
      })
      .catch((err) => console.error("Error fetching student:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectsChange = (selectedOptions) => {
    setFormData({ ...formData, subjects: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      subjects: formData.subjects.map((subject) => subject.value),
    };

    try {
      await axios.put(
        `https://student-dashboard-server.vercel.app/students/${id}`,
        updatedData
      );
      alert("User updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Update Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Last Name"
          required
        />
        <input
          type="text"
          name="studentID"
          value={formData.studentID}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Student ID"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Phone Number"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Address"
          required
        />

        <label className="block text-gray-700">Subjects</label>
        <Select
          isMulti
          name="subjects"
          options={[
            { value: "Math", label: "Math" },
            { value: "Science", label: "Science" },
            { value: "History", label: "History" },
            { value: "English", label: "English" },
            { value: "Computer Science", label: "Computer Science" },
          ]}
          value={formData.subjects}
          onChange={handleSubjectsChange}
          className="w-full border rounded"
        />
        <label className="block text-gray-700">Image URL (Cloudinary)</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter Cloudinary image URL"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Update Student
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
