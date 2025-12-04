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
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center transform hover:scale-105 transition duration-300">
        <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg drop-shadow-blue-500/50">
          Flappy Jet
        </h1>
        <p className="text-blue-600 mb-6 text-lg">
          Tap to fly, avoid the pipes, and beat the high score!
        </p>

     <div className="flex flex-col gap-4 w-64 mx-auto">

  {/* PLAY */}
  <button
    onClick={() => router.push("/play")}
    className="bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-105"
  >
    Play Guest ▶
  </button>

  {/* LOGIN */}
  <button
    onClick={() => router.push("/login")}
    className="bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-105"
  >
    Login
  </button>

  {/* REGISTER */}
  <button
    onClick={() => router.push("/register")}
    className="bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-105"
  >
    Register
  </button>

</div>
      </div>
    </div>
  );
}