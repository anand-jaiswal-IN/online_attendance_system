import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  Login,
  StudentDashboard,
  TeacherDashboard,
  HODDashboard,
  Home,
  ForgotPassword,
} from "./pages";

import { AttendanceSheet, OverallReport, Subjects } from "./components/teacher";

import { ProtectedRoute, PublicRoute } from "./wrapper";

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setAuthState({
      isAuthenticated: !!user,
      user,
      loading: false,
    });
  }, []);
  if (authState.loading) {
    return <div>Loading...</div>; // Add proper loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth">
          <Route
            path="login"
            element={
              <PublicRoute
                isAuthenticated={authState.isAuthenticated}
                redirectPath={"/dashboard-" + authState.user?.userType}
              >
                <Login />
              </PublicRoute>
            }
          />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route
          path="/dashboard-student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="subjects" replace />} />
          <Route path="subjects" index element={<Subjects />} />
          <Route path="attendance" element={<AttendanceSheet />} />
          <Route path="report" element={<OverallReport />} />
        </Route>

        <Route
          path="/dashboard-headOfDepartment"
          element={
            <ProtectedRoute allowedRoles={["headOfDepartment"]}>
              <HODDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
