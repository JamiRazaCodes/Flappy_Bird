"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Play() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const bird = { x: 80, y: 200, radius: 15, velocity: 0 };
  const gravity = 0.5;
  const jumpStrength = -8;
  let pipes = [];
  let animationFrame;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = 400);
    const height = (canvas.height = 600);

    const resetGame = () => {
      bird.y = 200;
      bird.velocity = 0;
      pipes = [];
      setScore(0);
      setIsGameOver(false);
    };

    const handleJump = () => {
      if (!isStarted) setIsStarted(true);
      if (!isGameOver) bird.velocity = jumpStrength;
      if (isGameOver) resetGame();
    };

    window.addEventListener("keydown", (e) => e.code === "Space" && handleJump());
    canvas.addEventListener("click", handleJump);

    const createPipe = () => {
      const gap = 140;
      const topHeight = Math.random() * (height - gap - 200) + 50;
      pipes.push({
        x: width,
        topHeight,
        bottomY: topHeight + gap,
      });
    };

    const draw = () => {
      ctx.fillStyle = "#70c5ce";
      ctx.fillRect(0, 0, width, height);

      // Bird
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.closePath();

      // Pipes
      ctx.fillStyle = "green";
      pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, 50, height - pipe.bottomY);
      });

      // Score
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText(`Score: ${score}`, 10, 30);

      if (isGameOver) {
        ctx.fillStyle = "red";
        ctx.font = "36px Arial";
        ctx.fillText("Game Over!", 100, height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press Space or Click to Restart", 45, height / 2 + 40);
      }
    };

    let frameCount = 0;
    const update = () => {
      if (isStarted && !isGameOver) {
        frameCount++;

        // Gravity
        bird.velocity += gravity;
        bird.y += bird.velocity;

        // Pipes movement
        pipes.forEach((pipe) => (pipe.x -= 3));

        // Remove old pipes
        if (pipes.length && pipes[0].x < -50) pipes.shift();

        // Add new pipes
        if (frameCount % 100 === 0) createPipe();

        // Collision detection
        pipes.forEach((pipe) => {
          if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + 50 &&
            (bird.y - bird.radius < pipe.topHeight ||
              bird.y + bird.radius > pipe.bottomY)
          ) {
            setIsGameOver(true);
          }

          // Score increase
          if (pipe.x + 50 === bird.x) setScore((s) => s + 1);
        });

        // Ground / ceiling collision
        if (bird.y + bird.radius > height || bird.y - bird.radius < 0) {
          setIsGameOver(true);
        }
      }

      draw();
      animationFrame = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", handleJump);
      canvas.removeEventListener("click", handleJump);
    };
  }, [isGameOver, isStarted]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-sky-300 to-sky-600">
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
        🐤 Flap Game
      </h1>
      <canvas ref={canvasRef} className="rounded-lg shadow-2xl border-4 border-white" />
      <p className="mt-4 text-white text-lg">
        {isStarted
          ? isGameOver
            ? "Click or press SPACE to restart"
            : "Click or press SPACE to jump"
          : "Click or press SPACE to start"}
      </p>
    </div>
  );
}
