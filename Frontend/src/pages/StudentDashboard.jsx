import React, { useState, useEffect } from "react";
import {
  LeaveApplicationForm,
  LeaveApplicationPage,
  NotificationPanel,
  Sidebar,
  AttendanceChart,
} from "../components/student";
import { Bell } from "lucide-react";

// Sample data
const subjects = [
  { name: "Mathematics", attendance: 42, totalClasses: 45 },
  { name: "Physics", attendance: 38, totalClasses: 45 },
  { name: "Chemistry", attendance: 40, totalClasses: 45 },
  { name: "English", attendance: 44, totalClasses: 45 },
  { name: "Computer Science", attendance: 41, totalClasses: 45 },
];

const notifications = [
  {
    id: "1",
    message:
      "Your attendance in Physics is below 85%. Please improve your attendance.",
    type: "warning",
    date: "2024-03-15",
  },
  {
    id: "2",
    message: "Your leave application for March 10-12 has been approved.",
    type: "info",
    date: "2024-03-14",
  },
];

function StudentDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const renderContent = () => {
    switch (currentPage) {
      case "leave-application":
        return <LeaveApplicationPage />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Attendance Overview
              </h2>
              <AttendanceChart subjects={subjects} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Subject-wise Attendance
              </h2>
              <div className="space-y-4">
                {subjects.map((subject) => {
                  const percentage = Math.round(
                    (subject.attendance / subject.totalClasses) * 100
                  );
                  return (
                    <div key={subject.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {subject.name}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            percentage >= 85
                              ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        theme={{ isDark, toggleTheme }}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />

      <div className="flex-1">
        <header className="bg-white dark:bg-gray-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentPage === "dashboard"
                  ? "Dashboard"
                  : "Leave Application"}
              </h1>
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                >
                  <Bell className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <span className="absolute top-0 right-0 h-3 w-3 bg-pink-500 rounded-full"></span>
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-96 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <NotificationPanel notifications={notifications} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
