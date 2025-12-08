import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

const { width, height } = Dimensions.get("window");

const PIPE_WIDTH = 60;
const GAP = 180;
const PIPE_SPEED = 3;
const JET_WIDTH = 90;
const JET_HEIGHT = 70;


export default function PlayScreen() {
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [jetY, setJetY] = useState(height / 2);
  const pipesRef = useRef<any[]>([]);
  const pipeCounterRef = useRef(0);


  const velocityRef = useRef(0);
  const jetYRef = useRef(height / 2);


  const gravity = 0.5;
  const jumpStrength = -8;

  // ✅ GAME LOOP USING setInterval (Works in RN)
  useEffect(() => {
    if (!isStarted || isGameOver) return;

const createPipe = () => {
  const minHeight = 60;
  const maxHeight = height - GAP - 200;
  const topHeight = Math.random() * maxHeight + minHeight;

  pipesRef.current.push({
    x: width,
    topHeight,
    bottomY: topHeight + GAP,
    passed: false,
  });
};

const loop = setInterval(() => {
  // Gravity
  velocityRef.current += gravity;
  jetYRef.current += velocityRef.current;

const newY = jetYRef.current;

if (newY < 0 || newY > height - 80) {
  setIsGameOver(true);
  return;
}

setJetY(newY);

  // Move pipes
  pipesRef.current.forEach((pipe) => {
    pipe.x -= PIPE_SPEED;
  });

  // Remove off-screen pipes
  pipesRef.current = pipesRef.current.filter(
    (pipe) => pipe.x > -PIPE_WIDTH
  );

  // Create new pipes
  if (pipeCounterRef.current % 90 === 0) {
    createPipe();
  }

  pipeCounterRef.current++;
}, 16);

    return () => clearInterval(loop);
  }, [isStarted, isGameOver]);

useEffect(() => {
  if (!isStarted || isGameOver) return;

  pipesRef.current.forEach((pipe) => {
    const jetLeft = width / 4;
    const jetRight = jetLeft + JET_WIDTH;
    const jetTop = jetY;
    const jetBottom = jetY + JET_HEIGHT;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;

    const hitTopPipe =
  jetRight > pipeLeft &&
  jetLeft < pipeRight &&
  jetTop <= pipe.topHeight + 5;

const hitBottomPipe =
  jetRight > pipeLeft &&
  jetLeft < pipeRight &&
  jetBottom >= pipe.bottomY - 5;

if (hitTopPipe || hitBottomPipe) {
  setIsGameOver(true);
}

    if (!pipe.passed && pipeRight < jetLeft) {
      pipe.passed = true;
      setScore((prev) => prev + 1);
    }
  });
}, [jetY]);


  const handleTap = () => {
    if (!isStarted) {
      setIsStarted(true);
      setIsGameOver(false);
      pipesRef.current = [];
      setScore(0);
      setJetY(height / 2);
      jetYRef.current = height / 2;
      velocityRef.current = 0;
      return;
    }

    if (isGameOver) {
      setIsGameOver(false);
      setIsStarted(false);
      pipesRef.current = [];
      return;
    }

    velocityRef.current = jumpStrength;
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {/* 🖼️ Background */}
        <Image
          source={require("../assets/images/bg.jpg")}
          style={styles.background}
        />

        {/* 🔝 Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>FLAPPY JET ✈️</Text>
          <Text style={styles.score}>{score}</Text>
        </View>

        {/* ✈️ Jet */}
        <Image
          source={require("../assets/images/jet.png")}
          style={[styles.jet, { top: jetY }]}
        />

      {pipesRef.current.map((pipe, index) => (
  <View key={index}>
    <View
      style={[
        styles.pipe,
        {
          top: 0,
          height: pipe.topHeight,
          left: pipe.x,
        },
      ]}
    />
    <View
      style={[
        styles.pipe,
        {
          top: pipe.bottomY,
          height: height - pipe.bottomY,
          left: pipe.x,
        },
      ]}
    />
  </View>
))}



        {/* 🧾 Status Text */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            {!isStarted
              ? "TAP TO START"
              : isGameOver
              ? "GAME OVER - TAP TO RESTART"
              : "TAP TO FLY"}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B34", // Dark game blue
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.9,
  },
  topBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  title: {
    color: "#00F5FF",
    fontSize: 24,
    fontWeight: "900",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  score: {
    color: "#FFD93D",
    fontSize: 24,
    fontWeight: "bold",
  },
  jet: {
    position: "absolute",
    left: width / 4,
    width: 90,
    height: 70,
    resizeMode: "contain",
  },
  messageBox: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  pipe: {
  position: "absolute",
  width: 60,
  backgroundColor: "#00e676",
  borderWidth: 3,
  borderColor: "#00c853",
  borderRadius: 10,
},

});
