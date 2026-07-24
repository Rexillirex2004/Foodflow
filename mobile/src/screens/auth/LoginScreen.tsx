import React, { useState } from "react";
import { Alert, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/types";
import { Screen, Title, Subtitle, Input, Button, colors } from "../../components/ui";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("owner@foodflow.demo");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      Alert.alert("No se pudo iniciar sesión", error?.response?.data?.error?.message ?? "Revisa tus credenciales");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title>FoodFlow</Title>
      <Subtitle>Inicia sesión para administrar tu restaurante</Subtitle>

      <Input
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ marginTop: 24 }}
      />
      <Input placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Entrar" onPress={handleLogin} loading={loading} />
      <Text
        onPress={() => navigation.navigate("Register")}
        style={{ color: colors.subtext, textAlign: "center", marginTop: 16 }}
      >
        ¿No tienes cuenta? Registra tu restaurante
      </Text>
    </Screen>
  );
}
