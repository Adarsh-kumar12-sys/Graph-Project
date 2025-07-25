// src/pages/SignupPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { greenToast } from '../utils/toastStyles';
import { redToast } from '../utils/toastStyles';

const SignupPage = () => {
  const [username, setUsername] = useState(""); // matches backend
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
      });

     toast("Signup successful! Please login.", greenToast);
      navigate("/login");
    } catch (err) {
      toast("Signup failed: " + (err.response?.data?.message || err.message), redToast);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default SignupPage;
