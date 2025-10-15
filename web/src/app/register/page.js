"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("Account created successfully! 🎉");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-400 to-yellow-200">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center transform hover:scale-105 transition duration-300">
        <h1 className="text-3xl font-extrabold mb-4 text-white drop-shadow-lg">
          Register
        </h1>
        <p className="text-gray-200 mb-6">Create your Flappy Bird account!</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-md bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-md bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="p-3 rounded-md bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />

          {error && <p className="text-red-300 text-sm">{error}</p>}
          {success && <p className="text-green-300 text-sm">{success}</p>}

          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-md font-semibold text-lg shadow-md transition-transform transform hover:scale-105"
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-md text-lg shadow-md transition-transform transform hover:scale-105"
          >
            ⬅ Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}