import axios from "axios";
import { Platform } from "react-native";
import * as TokenStorage from "./tokenStorage";
import { emit } from "./authEvents";

// Prioridad: variable de entorno explícita > fallback por plataforma.
// - iOS Simulator: comparte la red de la Mac -> "localhost" funciona.
// - Android Emulator: "localhost" apunta al propio emulador, no al host ->
//   se usa el alias especial 10.0.2.2.
// - Dispositivo físico (Expo Go) en la misma red WiFi que la PC: ni localhost
//   ni 10.0.2.2 funcionan -> hay que setear EXPO_PUBLIC_API_URL con la IP LAN
//   de la PC en mobile/.env (ver .env.example).
const fallback = Platform.OS === "android" ? "http://10.0.2.2:4000/api" : "http://localhost:4000/api";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? fallback;

export const TOKEN_KEY = "foodflow_token";

export const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use(async (config) => {
  const token = await TokenStorage.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      await TokenStorage.deleteItemAsync(TOKEN_KEY);
      emit("unauthorized");
    }

    if (status === 402) {
      emit("subscription-inactive", error.response?.data?.error?.details?.subscription);
    }

    return Promise.reject(error);
  }
);
