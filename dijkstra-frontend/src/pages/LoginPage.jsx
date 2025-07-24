// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import AuthContext
import { toast } from 'react-toastify';
import { greenToast } from '../utils/toastStyles'; // adjust path if needed
import { redToast } from '../utils/toastStyles';




const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Destructure login from context

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      login(res.data.token, res.data.username); // ✅ Call context's login function
      toast("Login successful!", greenToast);
      navigate("/network-designer"); // Go back to graph
    } catch (err) {
      toast("Login failed: " + (err.response?.data?.message || err.message), redToast);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/signup")}>
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
