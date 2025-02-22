import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, BookOpen, Calendar, FileText, LogOut } from "lucide-react";

function StudentDashboard() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    {
      to: "/dashboard-student/subjects",
      icon: <BookOpen size={20} />,
      text: "Your Subjects",
    },
    {
      to: "/dashboard-student/attendance",
      icon: <Calendar size={20} />,
      text: "Datewise Attendance",
    },
    {
      to: "/dashboard-student/leave",
      icon: <FileText size={20} />,
      text: "Leave Application",
    },
  ];
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <div className="flex">
        <div
          className={`min-h-screen bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 text-white shadow-xl transition-all duration-300 ${
            isOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="flex justify-between items-center p-6">
            <h2
              className={`font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100 transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Student Portal
            </h2>
            <br />
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="pl-4 border-2 rounded-2xl">
            <h3>
              Name : {user.firstName} {user.lastName}
            </h3>
            <h3>Roll Number : {user.rollNumber}</h3>
            <h3>
              Department : {user.departmentId}, {user.department.name}
            </h3>
            <h3>Semester : {user.presentSemester}</h3>
          </div>
          <nav className="mt-8 flex flex-col justify-between">
            <div>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center p-4 hover:bg-white/20 transition-all duration-300${
                      isActive ? "bg-white/20 border-r-4 border-white" : ""
                    }`
                  }
                >
                  {link.icon}
                  <span
                    className={`ml-4 font-medium transition-opacity duration-300 ${
                      isOpen ? "opacity-100" : "opacity-0 hidden"
                    }`}
                  >
                    {link.text}
                  </span>
                </NavLink>
              ))}
            </div>

            <button
              className=" mt-4 flex items-center w-full p-4 cursor-pointer bg-red-600 hover:bg-red-800 transition-all duration-300 rounded-3xl"
              onClick={() => {
                localStorage.removeItem("authToken"),
                  localStorage.removeItem("user"),
                  (window.location.href = "/auth/login");
              }}
            >
              <LogOut size={20} />
              <span
                className={`ml-4 font-medium transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                Logout
              </span>
            </button>
          </nav>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
