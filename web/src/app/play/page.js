"use client";
import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";

export default function Play() {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const jetRef = useRef({ x: 500, y: 200, radius: 15, velocity: 0 });
  const pipesRef = useRef([]);
  const frameRef = useRef(0);
  const gameActiveRef = useRef(false);
  const animationRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 📌 Set fullscreen canvas
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      widthRef.current = canvas.width;
      heightRef.current = canvas.height;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const gravity = 0.5;
    const jumpStrength = -8;

    const createPipe = () => {
      const width = widthRef.current;
      const height = heightRef.current;

      const gap = 160;
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

      jetRef.current = {
        x: 100,
        y: heightRef.current / 2,
        radius: 18,
        velocity: 0,
      };

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
      if (isGameOver) return resetGame();

      jetRef.current.velocity = jumpStrength;
    };

    const handleKey = (e) => {
      if (e.code === "Space") jump();
    };

    window.addEventListener("keydown", handleKey);
    canvas.addEventListener("click", jump);

    const bgImage = new Image();
    bgImage.src = "/bg.jpg";

    const jetImage = new Image();
    jetImage.src = "/flipjet.gif";

 let imagesLoaded = 0;

function checkStart() {
  if (imagesLoaded === 2) {
    console.log("All images loaded — starting game");
    update(); // start game loop
  }
}

// Background
bgImage.onload = () => {
  console.log("Background loaded");
  imagesLoaded++;
  checkStart();
};

bgImage.onerror = () => console.error("Failed to load background image!");

// Jet
jetImage.onload = () => {
  console.log("Jet loaded");
  imagesLoaded++;
  checkStart();
};

jetImage.onerror = () => console.error("Failed to load jet image!");

    const draw = () => {
      const width = widthRef.current;
      const height = heightRef.current;

  ctx.drawImage(bgImage, 0, 0, width, height);

   const jet = jetRef.current;
  const jetWidth = 140;
  const jetHeight = 70;
  ctx.drawImage(jetImage, jet.x - jetWidth/2, jet.y - jetHeight/2, jetWidth, jetHeight);


      // Pipes
    pipesRef.current.forEach(pipe => {
  // Create a vertical gradient for each pipe
  const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x, height);
  pipeGradient.addColorStop(0, "#32CD32"); // Lime Green top
  pipeGradient.addColorStop(1, "#6bb86bff"); // Darker green bottom

  ctx.fillStyle = pipeGradient;
  ctx.fillRect(pipe.x, 0, 60, pipe.topHeight);          // Top pipe
  ctx.fillRect(pipe.x, pipe.bottomY, 60, height - pipe.bottomY); // Bottom pipe

  // Optional: Add an outline for extra contrast
  ctx.strokeStyle = "#4aa54aff"; // Dark green border
  ctx.lineWidth = 3;
  ctx.strokeRect(pipe.x, 0, 60, pipe.topHeight);
  ctx.strokeRect(pipe.x, pipe.bottomY, 60, height - pipe.bottomY);
});


      // Game Over
      if (isGameOver) {
        ctx.fillStyle = "red";
        ctx.font = "60px Arial";
        ctx.fillText("Game Over!", width / 2 - 150, height / 2 - 40);
      }
    };

    const update = () => {
      const width = widthRef.current;
      const height = heightRef.current;
      const jet = jetRef.current;

      if (gameActiveRef.current && !isGameOver) {
        frameRef.current++;

        jet.velocity += gravity;
        jet.y += jet.velocity;

        pipesRef.current.forEach(pipe => (pipe.x -= 4));
        if (pipesRef.current[0]?.x < -60) pipesRef.current.shift();

        if (frameRef.current % 120 === 0) createPipe();

        // Collision with pipes
        pipesRef.current.forEach(pipe => {
          if (
            jet.x + jet.radius > pipe.x &&
            jet.x - jet.radius < pipe.x + 60 &&
            (jet.y - jet.radius < pipe.topHeight ||
              jet.y + jet.radius > pipe.bottomY)
          ) {
            setIsGameOver(true);
            gameActiveRef.current = false;
          }

          // Score
          if (!pipe.passed && pipe.x + 60 < jet.x) {
            pipe.passed = true;
            setScore(s => s + 1);
          }
        });

        // Collision with ground or ceiling
        if (jet.y + jet.radius > height || jet.y - jet.radius < 0) {
          setIsGameOver(true);
          gameActiveRef.current = false;
        }
      }

      draw();
      animationRef.current = requestAnimationFrame(update);
    };

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", setCanvasSize);
      canvas.removeEventListener("click", jump);
    };
  }, [isGameOver]);

  return (
  <div className="relative h-screen w-screen overflow-hidden">

  {/* FULLSCREEN CANVAS */}
  <canvas
    ref={canvasRef}
    className="absolute inset-0 w-full h-full"
  />

  {/* TITLE - TOP CENTER */}
<h1 className="absolute top-4 left-1/2 -translate-x-1/2 text-white drop-shadow-[0_0_10px_#0088CC] text-3xl font-bold z-10 flex items-center gap-2">
 
  Flappy Jet
   <NextImage
    src="/jet.gif"
    alt="Jet"
    width={80}
    height={80}
  />
</h1>


  {/* SCORE - TOP RIGHT */}
  <p className="absolute top-4 left-4 text-blue-600 text-2xl font-bold z-10">
    Score: {score}
  </p>

  {/* GAME MESSAGE - BOTTOM CENTER */}
  <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-blue-600 text-lg z-10">
    {isStarted
      ? isGameOver
        ? "Press SPACE or TAP to Restart"
        : "Press SPACE or TAP to Jump"
      : "Press SPACE or TAP to Start"}
  </p>
</div>

  );
}