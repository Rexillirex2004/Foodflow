import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { AuthStack } from "./AuthStack";
import { MainTabNavigator } from "./MainTabNavigator";
import { SubscriptionScreen } from "../screens/subscription/SubscriptionScreen";

export function RootNavigator() {
  const { isBootstrapping, isAuthenticated, isSubscriptionUsable } = useAuth();

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : !isSubscriptionUsable ? (
        // Paywall: la suscripción venció, se bloquea el resto de la app hasta reactivarla.
        <SubscriptionScreen blocking />
      ) : (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
}
