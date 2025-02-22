import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold mb-8">
        Welcome to the Student Management System
      </h1>
      <p className="text-2xl mb-12">
        This system allows students, teachers, and administrators to manage
        various aspects of student life.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/auth/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
