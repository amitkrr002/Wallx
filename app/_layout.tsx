import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform, View, Text, Image } from "react-native";
import RNSplashScreen from "react-native-splash-screen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  useEffect(() => {
    // Hide the splash screen after assets are loaded
    if (loaded) {
      // Hide Expo's splash screen
      SplashScreen.hideAsync();

      // Hide the native splash screen if not on web and if it's available
      if (
        Platform.OS !== "web" &&
        RNSplashScreen &&
        typeof RNSplashScreen.hide === "function"
      ) {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          RNSplashScreen.hide();
        }, 500);
      }
    }
  }, [loaded]);

  if (!loaded) {
    // Show a loading screen while fonts are loading
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#3b82f6",
        }}
      >
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={{ width: 150, height: 150, resizeMode: "contain" }}
        />
        <Text
          style={{
            marginTop: 20,
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
          }}
        >
          WallX
        </Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: !route.name.startsWith("tempobook"),
        })}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="categories" options={{ headerShown: false }} />
        <Stack.Screen name="favorites" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
