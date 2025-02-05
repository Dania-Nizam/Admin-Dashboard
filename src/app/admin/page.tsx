"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "almirashah35@gmail.com" && password === "dania") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 p-4">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 md:p-10 rounded-lg shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Admin Login</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4 font-semibold">{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300"
          value={email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300"
          value={password}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-bold px-4 py-2 rounded-lg w-full shadow-lg transform hover:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
}
