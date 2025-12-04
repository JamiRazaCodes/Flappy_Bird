import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View } from "react-native";
import { useFonts } from "expo-font";

export default function RootLayout() {
  // Load custom fonts (optional)
  const [loaded] = useFonts({
    // Example:
    // "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    // "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!loaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
    
        <StatusBar style="light" />

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: { backgroundColor: "#000" },
          }}
        />
      
    </View>
  );
}