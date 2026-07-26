import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { AuthProvider } from "./src/context/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/components/ui";
import { SplashScreen } from "./src/components/SplashScreen";

// Aplica la tipografía de marca (Poppins) a todo <Text>/<TextInput> de la app
// sin tener que tocar cada pantalla individualmente.
function applyDefaultFont() {
  const AnyText = Text as any;
  const AnyTextInput = TextInput as any;
  AnyText.defaultProps = AnyText.defaultProps || {};
  AnyText.defaultProps.style = [{ fontFamily: "Poppins_400Regular" }, AnyText.defaultProps.style];
  AnyTextInput.defaultProps = AnyTextInput.defaultProps || {};
  AnyTextInput.defaultProps.style = [{ fontFamily: "Poppins_400Regular" }, AnyTextInput.defaultProps.style];
}

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  const [showSplash, setShowSplash] = useState(true);

  if (fontsLoaded) {
    applyDefaultFont();
  } else {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar style="dark" />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </SafeAreaProvider>
  );
}
