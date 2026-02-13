import {
    Amiri_400Regular,
    Amiri_700Bold,
    useFonts as useAmiri,
} from "@expo-google-fonts/amiri";
import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { SettingsProvider } from "../context/SettingsContext";
import { useColorScheme } from "../hooks/use-color-scheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [amiriLoaded] = useAmiri({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  useEffect(() => {
    if (interLoaded && amiriLoaded) {
      SplashScreen.hideAsync();
    }
  }, [interLoaded, amiriLoaded]);

  if (!interLoaded || !amiriLoaded) {
    return null;
  }

  return (
    <SettingsProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="surah/[id]" options={{ title: "Surah Detail" }} />
          <Stack.Screen name="juz/[id]" options={{ title: "Juz Detail" }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SettingsProvider>
  );
}
