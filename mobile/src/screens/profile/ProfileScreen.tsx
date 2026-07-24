import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { ProfileStackParamList } from "../../navigation/types";
import { Screen, Title, Subtitle, Card, Button, Badge, colors } from "../../components/ui";

type Props = NativeStackScreenProps<ProfileStackParamList, "Profile">;

export function ProfileScreen({ navigation }: Props) {
  const { user, restaurant, subscription, isSubscriptionUsable, logout } = useAuth();

  return (
    <Screen>
      <Title>Perfil</Title>
      <Subtitle>{restaurant?.name}</Subtitle>

      <Card style={{ marginTop: 24 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>{user?.name}</Text>
        <Text style={{ color: colors.subtext, marginTop: 4 }}>{user?.email}</Text>
        <View style={{ marginTop: 8 }}>
          <Badge text={user?.role ?? ""} />
        </View>
      </Card>

      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: colors.text, fontWeight: "600" }}>Suscripción</Text>
          <Badge
            text={isSubscriptionUsable ? "Activa" : "Vencida"}
            color={isSubscriptionUsable ? colors.primary : colors.danger}
          />
        </View>
        <Text style={{ color: colors.subtext, marginTop: 4 }}>Plan: {subscription?.planName}</Text>
        <Button title="Ver detalle / pagar" variant="secondary" onPress={() => navigation.navigate("Subscription")} />
      </Card>

      <Button title="Cerrar sesión" variant="danger" onPress={logout} />
    </Screen>
  );
}
