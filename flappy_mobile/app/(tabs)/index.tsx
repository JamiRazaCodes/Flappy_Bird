import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
  <Text style={styles.title}>Flappy</Text>
  <Image
    source={require("../../assets/images/jet.gif")}
    style={{ width: 80, height: 100, marginLeft:5 }}
    resizeMode="contain"
  />
</View>


        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => router.push("/play")}
        >
          <Text style={styles.playText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallBtn}
          // onPress={() => router.push("/profile")}
        >
          <Text style={styles.smallText}>Profile</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => router.push("/")}
        >
          <Text style={styles.smallText}>Leaderboard</Text>
        </TouchableOpacity> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)", // slight blur effect
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 46,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 50,
  },
  playBtn: {
    backgroundColor: "#4DB8FF",
    paddingVertical: 16,
    paddingHorizontal: 45,
    borderRadius: 14,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  playText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  smallBtn: {
    backgroundColor: "#F8E71C",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  smallText: {
    fontSize: 18,
    color: "#2D3436",
    fontWeight: "600",
  },
});
