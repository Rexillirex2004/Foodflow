import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// expo-secure-store no tiene implementación en web (su build web es un
// objeto vacío), así que ahí usamos localStorage para lograr el mismo
// comportamiento (persistir el token) sin romper la carga inicial de la app.
export async function getItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return window.localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    window.localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  if (Platform.OS === "web") {
    window.localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
