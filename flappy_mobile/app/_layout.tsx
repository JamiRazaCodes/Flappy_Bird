import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View } from "react-native";
import { useFonts } from "expo-font";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
    
        <StatusBar style="light" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000" },
          }}
        />
      
    </View>
  );
}