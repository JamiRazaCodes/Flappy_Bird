"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 👇 Call your backend login API
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Save token
      localStorage.setItem("flappy_token", data.token);

      // ✅ Fetch user profile using token
      const profileRes = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await profileRes.json();

      // ✅ Save user info
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ Redirect to profile page
      router.push("/profile");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center transform hover:scale-105 transition duration-300">
        <h1 className="text-3xl font-extrabold mb-4 text-white drop-shadow-lg drop-shadow-blue-500/50">
          Player Login
        </h1>
        <p className="text-blue-600 mb-6">Welcome back to Flappy Bird!</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-md bg-white/20 text-white placeholder-zinc-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-md bg-white/20 text-white placeholder-zinc-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />

          {error && <p className="text-red-200 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-md font-semibold text-lg shadow-md transition-transform transform hover:scale-105"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-md text-lg shadow-md transition-transform transform hover:scale-105"
          >
            ⬅ Back
          </button>
        </form>
      </div>
    </div>
  );
}