"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Play() {
  const router = useRouter();
  const canvasRef = useRef(null);

  const runningRef = useRef(false);
  const bird = useRef({ x: 100, y: 0, vy: 0 });
  const pipes = useRef([]);
  const scoreRef = useRef(0);
  const bestScoreRef = useRef(0);

  const gravity = 0.6;
  const gap = 150;
  const pipeSpeed = 1;

  const [, setScore] = useState(0);
  const [, setBestScore] = useState(0);

  const birdImg = useRef(null);
  const cloudImg = useRef(null);

  // load images once
  useEffect(() => {
    birdImg.current = new Image();
    birdImg.current.src = "/pngwing.com.png";

    cloudImg.current = new Image();
    cloudImg.current.src = "/cloud.png";

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    reset();
    draw();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function reset() {
    const canvas = canvasRef.current;
    bird.current = { x: 100, y: canvas.height / 2, vy: 0 };
    pipes.current = [{ x: canvas.width + 60, top: 0, height: 200 }];
    scoreRef.current = 0;
    runningRef.current = false;
    setScore(0);
  }

  function loop() {
    update();
    draw();
    if (runningRef.current) requestAnimationFrame(loop);
  }

  function update() {
    const canvas = canvasRef.current;
    bird.current.vy += gravity;
    bird.current.y += bird.current.vy;

    if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < canvas.width / 2) {
      const topH = 100 + Math.random() * (canvas.height - 300);
      pipes.current.push({ x: canvas.width, top: 0, height: topH });
    }

    pipes.current.forEach((p, i) => {
      p.x -= pipeSpeed;
      if (!p.scored && bird.current.x > p.x + 52) {
        scoreRef.current += 1;
        p.scored = true;
        setScore(scoreRef.current);
      }
      if (p.x < -60) pipes.current.splice(i, 1);
    });

    // collision
    if (bird.current.y > canvas.height || bird.current.y < 0) gameOver();

    for (const p of pipes.current) {
      const pipeW = 52;
      if (bird.current.x + 15 > p.x && bird.current.x - 15 < p.x + pipeW) {
        if (bird.current.y - 12 < p.height || bird.current.y + 12 > p.height + gap) {
          gameOver();
        }
      }
    }
  }

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // --- Background ---
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#b0e0e6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- Clouds ---
    if (cloudImg.current && cloudImg.current.complete) {
      for (let i = 0; i < 5; i++) {
        const x = (i * 300 + Date.now() / 50) % canvas.width;
        const y = 50 + i * 60;
        ctx.drawImage(cloudImg.current, x, y, 120, 60);
      }
    }

    // --- Pipes ---
    pipes.current.forEach((p) => {
      const pipeGradient = ctx.createLinearGradient(p.x, 0, p.x + 52, 0);
      pipeGradient.addColorStop(0, "#27ae60");
      pipeGradient.addColorStop(1, "#2ecc71");
      ctx.fillStyle = pipeGradient;

      ctx.fillRect(p.x, 0, 52, p.height);
      ctx.fillRect(p.x, p.height + gap, 52, canvas.height - (p.height + gap));
    });

    // --- Bird ---
    if (birdImg.current && birdImg.current.complete) {
      const birdWidth = 100;
      const birdHeight = 24;
      ctx.drawImage(
        birdImg.current,
        bird.current.x - birdWidth / 2,
        bird.current.y - birdHeight / 2,
        birdWidth,
        birdHeight
      );
    }

    // --- Score ---
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(canvas.width / 2 - 60, 30, 120, 50);
    ctx.fillStyle = "white";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(scoreRef.current, canvas.width / 2, 65);
  }

  function flap() {
    bird.current.vy = -9;
    if (!runningRef.current) {
      runningRef.current = true;
      requestAnimationFrame(loop);
    }
  }

  function gameOver() {
    runningRef.current = false;
    bestScoreRef.current = Math.max(bestScoreRef.current, scoreRef.current);
    setBestScore(bestScoreRef.current);
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={flap}
      />

      <div className="absolute top-4 left-4 text-white text-lg bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg">
        Score: {scoreRef.current} — Best: {bestScoreRef.current}
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-700/70 backdrop-blur-md rounded-lg hover:bg-gray-600 transition"
        >
          Reset
        </button>
        <button
          onClick={flap}
          className="px-4 py-2 bg-green-600/70 backdrop-blur-md rounded-lg hover:bg-green-500 transition"
        >
          Flap
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-red-600/70 backdrop-blur-md rounded-lg hover:bg-red-500 transition"
        >
          ← Home
        </button>
      </div>
    </div>
  );
}
