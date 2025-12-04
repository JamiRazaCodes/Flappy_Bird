// app/(tabs)/leaderboard.tsx
import { View, Text } from "react-native";

export default function Leaderboard() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7ff",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#4b7bec" }}>
        Leaderboard Coming Soon
      </Text>
    </View>
  );
}