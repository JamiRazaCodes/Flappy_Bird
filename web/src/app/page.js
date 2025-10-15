"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("flappy_token");

    if (token) {
      router.replace("/profile"); // redirect to profile if logged in
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-400 to-yellow-200">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center transform hover:scale-105 transition duration-300">
        <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg">
          Flappy Bird
        </h1>
        <p className="text-gray-200 mb-6 text-lg">
          Tap to fly, avoid the pipes, and beat the high score!
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/play")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-md font-semibold text-lg shadow-md transition-transform transform hover:scale-105"
          >
            ▶ Play Guest
          </button>

          <button 
          onClick={() => router.push("/login")}
          className="bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-md text-lg shadow-md transition-transform transform hover:scale-105">
            Login
          </button>

          <button className="bg-teal-500 hover:bg-teal-400 text-white py-3 rounded-md text-lg shadow-md transition-transform transform hover:scale-105">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}