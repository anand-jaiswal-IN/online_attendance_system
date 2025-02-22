import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail } from 'lucide-react'; 
import logo from '../../public/Images/biet.png';

function ForgotPassword() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <img
            src={logo}
            alt="BIET Logo"
            className="mx-auto h-24 w-24 rounded-md shadow-lg"
          />
          <h1 className="text-xl font-semibold mt-4 font-[anzo2]">
            BUNDELKHAND INSTITUTE OF ENGINEERING & TECHNOLOGY, JHANSI
          </h1>
        </div>

        <form className="space-y-6">
         
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white shadow-sm hover:shadow-md transition-shadow"
              placeholder="Username"
              required
            />
          </div>

        
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white shadow-sm hover:shadow-md transition-shadow"
              placeholder="Email"
              required
            />
          </div>

      
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Submit
          </button>
          <div className="text-center">
            <Link to="/login" className="text-sm text-pink-600 hover:text-pink-800 transition-colors">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;