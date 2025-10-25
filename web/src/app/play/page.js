"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Play() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = 400);
    const height = (canvas.height = 600);

    const bird = { x: 80, y: 200, radius: 15, velocity: 0 };
    const gravity = 0.5;
    const jumpStrength = -8;

    let pipes = [];
    let frameCount = 0;
    let currentScore = 0;
    let animationFrame;
    let gameActive = false;

    const createPipe = () => {
      const gap = 140;
      const topHeight = Math.random() * (height - gap - 200) + 50;
      pipes.push({
        x: width,
        topHeight,
        bottomY: topHeight + gap,
        passed: false,
      });
    };

    const resetGame = () => {
      // Reset everything
      cancelAnimationFrame(animationFrame);
      pipes = [];
      frameCount = 0;
      bird.y = 200;
      bird.velocity = 0;
      currentScore = 0;
      setScore(0);
      setIsGameOver(false);
      setIsStarted(false);
      gameActive = false;
      draw(); // clear screen
    };

    const handleJump = () => {
      if (!isStarted) {
        setIsStarted(true);
        gameActive = true;
      }
      if (isGameOver) {
        resetGame();
      } else {
        bird.velocity = jumpStrength;
      }
    };

    window.addEventListener("keydown", (e) => e.code === "Space" && handleJump());
    canvas.addEventListener("click", handleJump);

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
      ctx.fillText(`Score: ${currentScore}`, 10, 30);

      if (isGameOver) {
        ctx.fillStyle = "red";
        ctx.font = "36px Arial";
        ctx.fillText("Game Over!", 100, height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press Space or Click to Restart", 45, height / 2 + 40);
      }
    };

    const update = () => {
      if (gameActive && !isGameOver) {
        frameCount++;

        bird.velocity += gravity;
        bird.y += bird.velocity;

        pipes.forEach((pipe) => (pipe.x -= 3));
        if (pipes.length && pipes[0].x < -50) pipes.shift();

        if (frameCount % 100 === 0) createPipe();

        pipes.forEach((pipe) => {
          // Collision
          if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + 50 &&
            (bird.y - bird.radius < pipe.topHeight ||
              bird.y + bird.radius > pipe.bottomY)
          ) {
            setIsGameOver(true);
            gameActive = false;
          }

          // Scoring
          if (!pipe.passed && pipe.x + 50 < bird.x) {
            pipe.passed = true;
            currentScore++;
            setScore(currentScore);
          }
        });

        // Out of bounds
        if (bird.y + bird.radius > height || bird.y - bird.radius < 0) {
          setIsGameOver(true);
          gameActive = false;
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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-sky-300 to-sky-600">
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
        🐤 Flap Flap
      </h1>
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-2xl border-4 border-white"
      />
      <p className="mt-4 text-white text-lg">
        {isStarted
          ? isGameOver
            ? "Click or press SPACE to restart"
            : "Click or press SPACE to jump"
          : "Click or press SPACE to start"}
      </p>
      <p className="mt-2 text-2xl text-yellow-300 font-bold drop-shadow-md">
        Score: {score}
      </p>
    </div>
  );
}
