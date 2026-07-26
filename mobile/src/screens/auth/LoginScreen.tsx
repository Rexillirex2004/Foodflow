import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/types";
import { Screen, Title, Subtitle, Input, Button, colors } from "../../components/ui";
import { Logo } from "../../components/Logo";

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
      <View style={{ alignItems: "center", marginTop: 16, marginBottom: 4 }}>
        <Logo size={76} />
        <Title>FoodFlow</Title>
        <Text
          style={{
            color: colors.primary,
            fontFamily: "Poppins_600SemiBold",
            fontSize: 14,
            marginTop: 2,
            marginBottom: 10,
          }}
        >
          El flujo inteligente de tu restaurante
        </Text>
      </View>
      <Subtitle>Inicia sesión para administrar tu restaurante</Subtitle>

      <Input
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ marginTop: 20 }}
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
