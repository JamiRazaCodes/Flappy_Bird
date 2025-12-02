"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Play() {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const birdRef = useRef({ x: 80, y: 200, radius: 15, velocity: 0 });
  const pipesRef = useRef([]);
  const frameRef = useRef(0);
  const gameActiveRef = useRef(false);
  const animationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = 400);
    const height = (canvas.height = 600);

    const gravity = 0.5;
    const jumpStrength = -8;

    const createPipe = () => {
      const gap = 140;
      const topHeight = Math.random() * (height - gap - 200) + 50;
      pipesRef.current.push({
        x: width,
        topHeight,
        bottomY: topHeight + gap,
        passed: false
      });
    };

    const resetGame = () => {
      cancelAnimationFrame(animationRef.current);

      birdRef.current = { x: 80, y: 200, radius: 15, velocity: 0 };
      pipesRef.current = [];
      frameRef.current = 0;

      setScore(0);
      setIsGameOver(false);
      setIsStarted(false);

      gameActiveRef.current = false;
      draw();
    };

    const jump = () => {
      if (!isStarted) {
        setIsStarted(true);
        gameActiveRef.current = true;
      }

      if (isGameOver) {
        resetGame();
        return;
      }

      birdRef.current.velocity = jumpStrength;
    };

    // FIX: Stable event handler
    const handleKey = (e) => {
      if (e.code === "Space") jump();
    };

    window.addEventListener("keydown", handleKey);
    canvas.addEventListener("click", jump);

    const draw = () => {
      ctx.fillStyle = "#70c5ce";
      ctx.fillRect(0, 0, width, height);

      const bird = birdRef.current;

      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();

      ctx.fillStyle = "green";
      pipesRef.current.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, 50, height - pipe.bottomY);
      });

      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText(`Score: ${score}`, 10, 30);

      if (isGameOver) {
        ctx.fillStyle = "red";
        ctx.font = "36px Arial";
        ctx.fillText("Game Over!", 100, height / 2);
      }
    };

    const update = () => {
      const bird = birdRef.current;

      if (gameActiveRef.current && !isGameOver) {
        frameRef.current++;

        bird.velocity += gravity;
        bird.y += bird.velocity;

        pipesRef.current.forEach(pipe => (pipe.x -= 3));
        if (pipesRef.current[0]?.x < -50) pipesRef.current.shift();

        if (frameRef.current % 100 === 0) createPipe();

        pipesRef.current.forEach(pipe => {
          if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + 50 &&
            (bird.y - bird.radius < pipe.topHeight ||
              bird.y + bird.radius > pipe.bottomY)
          ) {
            setIsGameOver(true);
            gameActiveRef.current = false;
          }

          if (!pipe.passed && pipe.x + 50 < bird.x) {
            pipe.passed = true;
            setScore(s => s + 1);
          }
        });

        if (bird.y + bird.radius > height || bird.y - bird.radius < 0) {
          setIsGameOver(true);
          gameActiveRef.current = false;
        }
      }

      draw();
      animationRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("click", jump);
    };
  }, [isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-sky-600">
      <h1 className="text-4xl text-white font-bold mb-4">🐤 Flap Flap</h1>
      <canvas ref={canvasRef} className="rounded-lg border-4 border-white shadow-xl" />
      <p className="text-white mt-4">
        {isStarted
          ? isGameOver
            ? "Click SPACE to Restart"
            : "Jump with SPACE"
          : "Press SPACE to Start"}
      </p>
      <p className="text-yellow-300 text-xl font-bold">Score: {score}</p>
    </div>
  );
}