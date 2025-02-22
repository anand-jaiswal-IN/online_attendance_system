import React, { useState } from "react";
import { Users, UserPlus, Menu, X, BookOpen } from "lucide-react";

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    rollNumber: "",
    email: "",
    phoneNumber: "",
    gender: "",
    role: "",
    qualification: "",
    dateOfBirth: "",
    dateOfJoining: "",
    aadharNumber: "",
    permanentAddress: "",
    temporaryAddress: "",
    departmentId: "",
  });

  const departments = [
    { id: 1, name: "Computer Science & Engineering" },
    { id: 2, name: "Mechanical Engineering" },
    { id: 3, name: "Electrical Engineering" },
    { id: 4, name: "Electronics Engineering" },
    { id: 5, name: "Chemical Engineering" },
    { id: 6, name: "Information Technology" },
    { id: 7, name: "Civil Engineering" },
  ];

  const roles = [
    { id: "teacher", name: "Teacher", icon: BookOpen },
    { id: "hod", name: "HOD", icon: Users },
    { id: "Student", name: "Student", icon: UserPlus },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex">
      <div
        className={`bg-gradient-to-b from-pink-400 to-purple-600 text-white ${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2
            className={`font-[anzo1] text-xl ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            Admin Dashboard
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-pink-500 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 mb-4">
            <h3
              className={` font-[anzo1] text-pink-00 ${
                isSidebarOpen ? "block" : "hidden"
              }`}
            >
              Create Account
            </h3>
          </div>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full flex items-center px-4 py-3 hover:bg-pink-500 transition-colors
                ${selectedRole === role.id ? "bg-pink-500" : ""}`}
            >
              <role.icon size={20} />
              {isSidebarOpen && (
                <span className="ml-3 font-[anzo5]">{role.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-pink-700">
              Create{" "}
              {selectedRole
                ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
                : "User"}{" "}
              Account
            </h1>
          </div>
        </header>

        <main className="p-6">
          {selectedRole && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-[anzo1] text-pink-700">
                      Personal Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    {selectedRole === "Student" ? (
                      <div>
                        <label className="block text-sm font-medium text-pink-700">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-pink-700">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-[anzo1] text-pink-700">
                      Professional Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Department
                      </label>
                      <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Date of Joining
                      </label>
                      <input
                        type="date"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Aadhar Number
                      </label>
                      <input
                        type="text"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-pink-700">
                      Address Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Permanent Address
                      </label>
                      <textarea
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pink-700">
                        Temporary Address
                      </label>
                      <textarea
                        name="temporaryAddress"
                        value={formData.temporaryAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-pink-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
