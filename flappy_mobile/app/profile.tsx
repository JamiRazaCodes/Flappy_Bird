import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const user = {
    name: "Jami Raza",
    email: "jami@example.com",
    avatar: "https://i.pravatar.cc/150",
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#070B34", justifyContent: "center", alignItems: "center" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20, borderWidth: 2, borderColor: "#00E5FF" },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  email: { color: "#aaa", marginBottom: 30 },
  logoutBtn: { backgroundColor: "#ff5252", padding: 15, borderRadius: 10 },
  logoutText: { color: "#fff", fontWeight: "bold" },
});