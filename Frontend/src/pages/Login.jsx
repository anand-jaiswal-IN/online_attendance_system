import React, { useState, useEffect } from "react";
import {
  BookOpen,
  GraduationCap,
  Lock,
  User,
  School,
  ChevronDown,
  Users,
} from "lucide-react";
import logo from "../../public/Images/biet.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../apis/axiosInstance";
import Alert from "../components/ui/Alert";
import useAlert from "../hooks/alert";

function Login() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userType, setUserType] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();

  const [isAnimated, setIsAnimated] = useState(false);

  const typeOfUsers = {
    Student: "student",
    Teacher: "teacher",
    HOD: "headOfDepartment",
  };

  // Trigger animation when component mounts
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const getUserTypeIcon = (type) => {
    switch (type) {
      case "Student":
        return <GraduationCap className="w-5 h-5 text-pink-600" />;
      case "Teacher":
        return <BookOpen className="w-5 h-5 text-pink-600" />;
      case "HOD":
        return <Users className="w-5 h-5 text-pink-600" />;
      default:
        return <User className="w-5 h-5 text-pink-600" />;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password || !userType) {
        alert("Please fill in all fields");
        return;
      }
      const response = await api.post("/auth/login", {
        username: username,
        password: password,
        typeOfUser: userType,
      });
      const token = response.data.data.token;
      localStorage.setItem("authToken", token);

      const userResponse = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem("user", JSON.stringify(userResponse.data.data));
      showAlert("Login successful", "success");

      switch (userType) {
        case "student":
          navigate("/dashboard-student");
          break;
        case "teacher":
          navigate("/dashboard-teacher");
          break;
        case "headOfDepartment":
          navigate("/dashboard-headOfDepartment");
          break;
        default:
          navigate("/");
      }
      return;
    } catch (error) {
      showAlert("Wrong Credentials", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-pink-50 to-purple-50">
      {alert.show && (
        <Alert message={alert.message} type={alert.type} onClose={hideAlert} />
      )}
      <div className="md:w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 p-8 md:p-12 flex items-center justify-center">
        <div className="max-w-2xl text-white text-center">
          <div className="mb-8 md:mb-16">
            <img
              src={logo}
              className="mx-auto h-24 w-24 md:h-32 md:w-32 rounded-md shadow-lg"
            />
          </div>
          <div className="flex items-center gap-2 mb-6 justify-center">
            <School className="w-8 h-8" />
            <h1 className="text-[18px] md:text--[18px] font-[anzo3] font-semibold whitespace-nowrap">
              BUNDELKHAND INSTITUTE OF ENGINEERING & TECHNOLOGY, JHANSI
            </h1>
          </div>
          <h2
            className={`text-3xl md:text-4xl font-[anzo1] mb-6 transition-all duration-1000 ease-out ${
              isAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Welcome To Online Attendance Management System
          </h2>
        </div>
      </div>

      <div className="md:w-1/2 bg-white p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Login to Your Account
          </h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="flex items-center gap-2">
                  {getUserTypeIcon(userType)}
                  <span className="">
                    {Object.keys(typeOfUsers).find(
                      (key) => typeOfUsers[key] === userType
                    )}
                  </span>
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                  {Object.entries(typeOfUsers).map(([typeKey, typeValue]) => (
                    <div
                      key={typeKey}
                      className="px-4 py-2 hover:bg-pink-50 cursor-pointer flex items-center gap-2 transition-colors"
                      onClick={() => {
                        setUserType(typeValue); // Store the value
                        setIsDropdownOpen(false);
                      }}
                    >
                      {getUserTypeIcon(typeKey)}
                      <span className="capitalize">{typeKey}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white shadow-sm hover:shadow-md transition-shadow"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white shadow-sm hover:shadow-md transition-shadow"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Login
            </button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-pink-600 hover:text-pink-800 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
