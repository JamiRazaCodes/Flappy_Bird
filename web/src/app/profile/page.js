"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("flappy_token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      router.replace("/");
    } else {
      setUser(savedUser ? JSON.parse(savedUser) : { name: "Player", email: "Unknown" });
    }
  }, [router]);

  if (!user) return null;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-400 to-yellow-200">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl text-center border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-6">🎮 Player Profile</h1>
        <p className="text-yellow-200 text-lg mb-4">Name: {user.name}</p>
        <p className="text-yellow-200 text-lg">Email: {user.email}</p>

        <div className="flex flex-col items-center gap-2 mt-4">
  <button
    onClick={() => router.push("/play")}
    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:from-indigo-600 hover:to-pink-600 active:scale-95"
  >
    🚀 Start Flap
  </button>

  <button
    onClick={() => {
      localStorage.removeItem("flappy_token");
      localStorage.removeItem("user");
      router.replace("/");
    }}
    className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-6 rounded-md font-semibold text-lg shadow-md transition-transform transform hover:scale-105"
  >
    Logout
  </button>
</div>

      </div>
    </div>
  );
}