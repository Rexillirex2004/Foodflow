import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Screen, Title, Subtitle, Card, Button, Badge, colors } from "../../components/ui";

function formatDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString();
}

function daysLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function SubscriptionScreen({ blocking = false }: { blocking?: boolean }) {
  const { subscription, isSubscriptionUsable, payMockSubscription, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      await payMockSubscription();
      Alert.alert("Pago exitoso", "Tu suscripción está activa.");
    } catch {
      Alert.alert("Error", "No se pudo procesar el pago simulado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const statusLabel: Record<string, string> = {
    TRIAL: "Período de prueba",
    ACTIVE: "Activa",
    EXPIRED: "Vencida",
    CANCELED: "Cancelada",
  };
  const statusColor = isSubscriptionUsable ? colors.primary : colors.danger;

  return (
    <Screen>
      <Title>{blocking ? "Tu suscripción venció" : "Suscripción"}</Title>
      {blocking && (
        <Subtitle>
          Para seguir usando FoodFlow (menú, mesas, pedidos, facturación y reportes) reactiva tu suscripción.
        </Subtitle>
      )}

      {subscription && (
        <Card style={{ marginTop: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>{subscription.planName}</Text>
            <Badge text={statusLabel[subscription.status] ?? subscription.status} color={statusColor} />
          </View>

          <Text style={{ color: colors.subtext, marginTop: 12 }}>
            Precio: ${(subscription.priceCents / 100).toFixed(2)} / mes
          </Text>

          {subscription.status === "TRIAL" && (
            <Text style={{ color: colors.subtext, marginTop: 4 }}>
              Prueba gratis hasta el {formatDate(subscription.trialEndsAt)} ({daysLeft(subscription.trialEndsAt)} días
              restantes)
            </Text>
          )}

          {subscription.currentPeriodEnd && (
            <Text style={{ color: colors.subtext, marginTop: 4 }}>
              Próxima renovación: {formatDate(subscription.currentPeriodEnd)}
            </Text>
          )}
        </Card>
      )}

      <Button title="Pagar ahora (simulado)" onPress={handlePay} loading={loading} />

      {blocking && <Button title="Cerrar sesión" variant="secondary" onPress={logout} />}
    </Screen>
  );
}
