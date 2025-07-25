// src/pages/LoginPage.jsx
// import React, { useState } from "react";    // new comment out

import React, { useState, useEffect } from "react"; // ✅ include useEffect   // new

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";   // new


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoggedIn } = useAuth(); // ✅ new


  useEffect(() => {                       // new
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]); // ✅ Prevents access if already logged in

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // localStorage.setItem("token", res.data.token);         // new comment out
      // localStorage.setItem("username", res.data.username);   // new comment out

      login(res.data.token, res.data.username);       // new


      alert("Login successful!");
      navigate("/"); // Go back to graph
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || err.message);
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
