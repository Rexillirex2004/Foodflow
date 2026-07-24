import React, { useState } from "react";
import { Alert, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/types";
import { Screen, Title, Subtitle, Input, Button, colors } from "../../components/ui";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    try {
      await register({ restaurantName, ownerName, email: email.trim(), password });
    } catch (error: any) {
      Alert.alert("No se pudo registrar", error?.response?.data?.error?.message ?? "Intenta de nuevo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title>Crea tu restaurante</Title>
      <Subtitle>14 días de prueba gratis, sin tarjeta</Subtitle>

      <Input
        placeholder="Nombre del restaurante"
        value={restaurantName}
        onChangeText={setRestaurantName}
        style={{ marginTop: 24 }}
      />
      <Input placeholder="Tu nombre" value={ownerName} onChangeText={setOwnerName} />
      <Input
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Input placeholder="Contraseña (mín. 8 caracteres)" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Crear cuenta" onPress={handleRegister} loading={loading} />
      <Text
        onPress={() => navigation.navigate("Login")}
        style={{ color: colors.subtext, textAlign: "center", marginTop: 16 }}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </Screen>
  );
}
