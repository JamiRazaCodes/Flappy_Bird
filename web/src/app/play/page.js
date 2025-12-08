import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Svg, { Rect, Image as SvgImage } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 60;
const GAP = 180;

export default function App() {
  const engineRef = useRef(null);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

 const [jet, setJet] = useState({});

 setJet({
  x: 100,
  y: height / 2,
  velocity: 0,
  radius: 20,
 })

  const [pipes, setPipes] = useState<any[0]>([]);
  const frame = useRef(0);

  const reset = () => {
    setJet({
  x: 100,
  y: height / 2,
  velocity: 0,
  radius: 20,
});
setPipes([]);
    frame.current = 0;
    setScore(0);
    setGameOver(false);
    setStarted(false);
  };

  const jump = () => {
    if (gameOver) return reset();
    setStarted(true);
   setJet(prev => ({
  ...prev,
  velocity: JUMP_STRENGTH,
})); 
  };

  const createPipe = () => {
  const topHeight = Math.random() * (height - GAP - 200) + 50;
  setPipes(prev => [
    ...prev,
    {
      x: width,
      topHeight,
      passed: false,
    }
  ]);
};

  const update = () => {
  if (!started || gameOver) return;

  frame.current++;

  // Move Jet
  setJet(prev => {
    const vel = prev.velocity + GRAVITY;
    const newY = prev.y + vel;
    return { ...prev, velocity: vel, y: newY };
  });

  // Move pipes
  setPipes(prev =>
    prev
      .map(p => ({ ...p, x: p.x - 4 }))
      .filter(p => p.x > -PIPE_WIDTH)
  );

  // Create new pipe
  if (frame.current % 100 === 0) {
    createPipe();
  }

  const j = jet;

  // Collisions
  if (j.y > height || j.y < 0) {
    setGameOver(true);
  }

  pipes.forEach((p, index) => {
    const bottomY = p.topHeight + GAP;

    const collideX =
      j.x + j.radius > p.x && j.x - j.radius < p.x + PIPE_WIDTH;

    const collideY =
      j.y - j.radius < p.topHeight ||
      j.y + j.radius > bottomY;

    if (collideX && collideY) {
      setGameOver(true);
    }

    if (!p.passed && p.x + PIPE_WIDTH < j.x) {
      const newPipes = [...pipes];
      newPipes[index].passed = true;
      setPipes(newPipes);
      setScore(s => s + 1);
    }
  });
};

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>

        <GameEngine
          ref={engineRef}
          systems={[(entities, { time }) => {
  update();
  return entities;
}]}
          entities={{}}
          running
          style={styles.game}
        >
          <Svg width={width} height={height}>
            {/* Background */}
            <Rect width={width} height={height} fill="#70c5ce" />

            {/* Pipes */}
            {pipes.map((p, index) => {
              const bottomY = p.topHeight + GAP;
              return (
                <React.Fragment key={index}>
                  <Rect
                    x={p.x}
                    y={0}
                    width={PIPE_WIDTH}
                    height={p.topHeight}
                    fill="#32CD32"
                  />
                  <Rect
                    x={p.x}
                    y={bottomY}
                    width={PIPE_WIDTH}
                    height={height - bottomY}
                    fill="#2E8B57"
                  />
                </React.Fragment>
              );
            })}

            {/* Jet */}
            <SvgImage
              href={require("../assets/flipjet.gif")}
              x={jet.x - 35}
              y={jet.y - 20}
              width={70}
              height={40}
            />
          </Svg>
        </GameEngine>

        {/* UI Overlay */}
        <Text style={styles.title}>Flappy Jet ✈️</Text>
        <Text style={styles.score}>Score: {score}</Text>

        <Text style={styles.info}>
          {started
            ? gameOver
              ? "Tap to Restart"
              : "Tap to Jump"
            : "Tap to Start"}
        </Text>

        {gameOver && (
          <Text style={styles.gameOver}>GAME OVER</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  game: {
    flex: 1,
  },
  title: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#00ffff",
  },
  score: {
    position: "absolute",
    top: 40,
    left: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e90ff",
  },
  info: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    fontSize: 16,
    color: "#00aaff",
  },
  gameOver: {
    position: "absolute",
    top: height / 2 - 40,
    alignSelf: "center",
    fontSize: 40,
    fontWeight: "bold",
    color: "red",
  },
});