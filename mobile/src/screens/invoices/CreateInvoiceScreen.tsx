import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InvoicesStackParamList } from "../../navigation/types";
import { Order, PaymentMethod } from "../../types/models";
import * as ordersApi from "../../api/orders.api";
import * as invoicesApi from "../../api/invoices.api";
import { Screen, Title, Subtitle, Card, Input, Button, EmptyState, colors } from "../../components/ui";

type Props = NativeStackScreenProps<InvoicesStackParamList, "CreateInvoice">;

export function CreateInvoiceScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [tip, setTip] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ordersApi
      .getOrder(orderId)
      .then(setOrder)
      .catch(() => Alert.alert("Error", "No se pudo cargar el pedido"))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading || !order) {
    return (
      <Screen>
        <EmptyState text="Cargando..." />
      </Screen>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tipAmount = Number(tip.replace(",", ".")) || 0;

  async function handleCharge() {
    setSaving(true);
    try {
      await invoicesApi.createInvoice({ orderId, tipAmount, paymentMethod });
      Alert.alert("Cobrado", "Factura generada correctamente");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.error?.message ?? "No se pudo generar la factura");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Title>{order.table.name}</Title>
      <Subtitle>Resumen del pedido</Subtitle>

      <Card style={{ marginTop: 16 }}>
        {order.items.map((item) => (
          <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ color: colors.subtext }}>
              {item.quantity}x {item.menuItem.name}
            </Text>
            <Text style={{ color: colors.text }}>${(item.unitPrice * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={{ borderTopWidth: 1, borderColor: colors.border, marginTop: 8, paddingTop: 8 }}>
          <Text style={{ color: colors.text }}>Subtotal: ${subtotal.toFixed(2)}</Text>
        </View>
      </Card>

      <Input placeholder="Propina" keyboardType="decimal-pad" value={tip} onChangeText={setTip} />

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        <Button
          title="Efectivo"
          variant={paymentMethod === "CASH" ? "primary" : "secondary"}
          onPress={() => setPaymentMethod("CASH")}
        />
        <Button
          title="Tarjeta"
          variant={paymentMethod === "CARD" ? "primary" : "secondary"}
          onPress={() => setPaymentMethod("CARD")}
        />
      </View>

      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
        Total estimado: ${(subtotal + tipAmount).toFixed(2)} + impuesto
      </Text>

      <Button title="Cobrar" onPress={handleCharge} loading={saving} />
    </Screen>
  );
}
