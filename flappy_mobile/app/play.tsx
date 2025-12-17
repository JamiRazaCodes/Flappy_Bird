import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Audio } from "expo-av";

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

  const jetYRef = useRef(height / 2);
  const velocityRef = useRef(0);
  const pipesRef = useRef<any[]>([]);
  const pipeCounterRef = useRef(0);

  const gravity = 0.5;
  const jumpStrength = -8;

  const flySound = useRef<Audio.Sound | null>(null);
  const boomSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
  const loadSounds = async () => {
    const fly = new Audio.Sound();
    const boom = new Audio.Sound();

    await fly.loadAsync(require("../assets/sounds/fly.wav"));
    await boom.loadAsync(require("../assets/sounds/hit.wav"));

    flySound.current = fly;
    boomSound.current = boom;
  };

  loadSounds();

  return () => {
    flySound.current?.unloadAsync();
    boomSound.current?.unloadAsync();
  };
}, []);

  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const createPipe = () => {
      const minHeight = 60;
      const maxHeight = height - GAP - 150;
      const topHeight = Math.random() * maxHeight + minHeight;

      pipesRef.current.push({
        x: width,
        topHeight,
        bottomY: topHeight + GAP,
        passed: false,
      });
    };

    const loop = setInterval(() => {
      velocityRef.current += gravity;
      jetYRef.current += velocityRef.current;

      if (jetYRef.current < 0 || jetYRef.current > height - JET_HEIGHT) {
        setIsGameOver(true);
        flySound.current?.stopAsync();
        boomSound.current?.replayAsync();
        return;
      }

      setJetY(jetYRef.current);

     pipesRef.current.forEach((pipe) => {
  pipe.x -= PIPE_SPEED;

  const HITBOX = 22;

  const jetLeft = width / 4 + HITBOX;
  const jetRight = jetLeft + JET_WIDTH - HITBOX * 2;
  const jetTop = jetYRef.current + HITBOX;
  const jetBottom = jetTop + JET_HEIGHT - HITBOX * 2;

  const pipeLeft = pipe.x + 6;
  const pipeRight = pipe.x + PIPE_WIDTH - 6;

  const hit =
    jetRight > pipeLeft &&
    jetLeft < pipeRight &&
    (jetTop < pipe.topHeight || jetBottom > pipe.bottomY);

  if (hit) {
    setIsGameOver(true);
  }

  if (!pipe.passed && pipeRight < jetLeft) {
    pipe.passed = true;
    setScore((s) => s + 1);
  }
});

      pipesRef.current = pipesRef.current.filter(
        (pipe) => pipe.x > -PIPE_WIDTH
      );

      if (pipeCounterRef.current % 90 === 0) {
        createPipe();
      }

      pipeCounterRef.current++;
    }, 16);

    return () => clearInterval(loop);
  }, [isStarted, isGameOver]);

  const handleTap = () => {
    if (!isStarted) {
      setIsStarted(true);
      setIsGameOver(false);
      pipesRef.current = [];
      setScore(0);
      jetYRef.current = height / 2;
      velocityRef.current = 0;
      setJetY(height / 2);
      flySound.current?.replayAsync();
      boomSound.current?.stopAsync(); 
      return;
    }

    if (isGameOver) {
      setIsGameOver(false);
      setIsStarted(false);
      flySound.current?.stopAsync(); 
      boomSound.current?.replayAsync(); 
      pipesRef.current = [];
      return;
    }

    velocityRef.current = jumpStrength;
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/bg.jpg")}
          style={styles.background}
        />

        <View style={styles.topBar}>
          <Text style={styles.title}>FLAPPY JET ✈️</Text>
          <Text style={styles.score}>{score}</Text>
        </View>

        <Image
          source={require("../assets/images/jet.png")}
          style={[styles.jet, { top: jetY }]}
        />

        {pipesRef.current.map((pipe, index) => (
          <View key={index}>
            <View
              style={[
                styles.pipe,
                { top: 0, height: pipe.topHeight, left: pipe.x },
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
  container: { flex: 1, backgroundColor: "#070B34" },
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
    zIndex: 10,
  },
  title: { color: "#00F5FF", fontSize: 24, fontWeight: "900" },
  score: { color: "#FFD93D", fontSize: 24, fontWeight: "bold" },
  jet: {
    position: "absolute",
    left: width / 4,
    width: 90,
    height: 70,
    resizeMode: "contain",
    backgroundColor: "rgba(255,0,0,0.3)"

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
  messageText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  pipe: {
    position: "absolute",
    width: 60,
    backgroundColor: "#00e676",
    borderWidth: 3,
    borderColor: "#00c853",
    borderRadius: 10,
  },
});