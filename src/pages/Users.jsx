import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Users = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "https://student-dashboard-server.vercel.app/students"
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://student-dashboard-server.vercel.app/students/${id}`
      );
      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Student List</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Total Students: {students.length}
        </h2>
        <Link to="/create">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            + Add Student
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-gray-500">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border rounded-lg shadow-lg">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3 border">Image</th>
                <th className="p-3 border">First Name</th>
                <th className="p-3 border">Last Name</th>
                <th className="p-3 border">Student ID</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border hidden md:table-cell">Address</th>
                <th className="p-3 border hidden md:table-cell">Subjects</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    <img
                      src={student.image}
                      alt="student"
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="p-3 border">{student.firstName}</td>
                  <td className="p-3 border">{student.lastName}</td>
                  <td className="p-3 border">{student.studentID}</td>
                  <td className="p-3 border">{student.email}</td>
                  <td className="p-3 border hidden md:table-cell">
                    {student.address}
                  </td>
                  <td className="p-3 border hidden md:table-cell">
                    {student.subjects ? student.subjects.join(", ") : "N/A"}
                  </td>
                  <td className="p-3 border flex gap-2">
                    <Link to={`/update/${student._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
