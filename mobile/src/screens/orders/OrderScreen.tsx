import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TablesStackParamList } from "../../navigation/types";
import { MenuItem, Order } from "../../types/models";
import * as ordersApi from "../../api/orders.api";
import * as menuApi from "../../api/menu.api";
import { Screen, Title, Subtitle, Card, Button, EmptyState, colors } from "../../components/ui";

type Props = NativeStackScreenProps<TablesStackParamList, "Order">;

const NEXT_STATUS_LABEL: Record<string, string> = {
  OPEN: "Enviar a cocina",
  READY: "Marcar como servido",
};

const NEXT_STATUS: Record<string, "IN_PROGRESS" | "SERVED"> = {
  OPEN: "IN_PROGRESS",
  READY: "SERVED",
};

export function OrderScreen({ route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const [orderData, menuItems] = await Promise.all([ordersApi.getOrder(orderId), menuApi.listItems()]);
      setOrder(orderData);
      setAvailableItems(menuItems.filter((m) => m.available));
    } catch {
      Alert.alert("Error", "No se pudo cargar el pedido");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(item: MenuItem) {
    if (!order) return;
    setBusy(true);
    try {
      const updated = await ordersApi.addOrderItem(order.id, { menuItemId: item.id, quantity: 1 });
      setOrder(updated);
    } catch {
      Alert.alert("Error", "No se pudo agregar el plato");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(itemId: string) {
    if (!order) return;
    setBusy(true);
    try {
      const updated = await ordersApi.removeOrderItem(order.id, itemId);
      setOrder(updated);
    } catch {
      Alert.alert("Error", "No se pudo quitar el plato");
    } finally {
      setBusy(false);
    }
  }

  async function handleAdvanceStatus() {
    if (!order) return;
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    if (order.items.length === 0) {
      Alert.alert("Pedido vacío", "Agrega al menos un plato antes de enviarlo a cocina");
      return;
    }

    setBusy(true);
    try {
      const updated = await ordersApi.updateOrderStatus(order.id, next);
      setOrder(updated);
    } catch {
      Alert.alert("Error", "No se pudo actualizar el estado del pedido");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !order) {
    return (
      <Screen>
        <EmptyState text="Cargando pedido..." />
      </Screen>
    );
  }

  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const canEditItems = order.status === "OPEN";
  const nextAction = NEXT_STATUS_LABEL[order.status];

  return (
    <Screen>
      <Title>{order.table.name}</Title>
      <Subtitle>Estado: {order.status}</Subtitle>

      <FlatList
        style={{ marginTop: 16, maxHeight: 260 }}
        data={order.items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<EmptyState text="Sin platos todavía" />}
        renderItem={({ item }) => (
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  {item.quantity}x {item.menuItem.name}
                </Text>
                <Text style={{ color: colors.subtext }}>${(item.unitPrice * item.quantity).toFixed(2)}</Text>
              </View>
              {canEditItems && (
                <Pressable onPress={() => handleRemove(item.id)}>
                  <Text style={{ color: colors.danger, fontWeight: "700" }}>Quitar</Text>
                </Pressable>
              )}
            </View>
          </Card>
        )}
      />

      <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700", marginVertical: 8 }}>
        Total: ${total.toFixed(2)}
      </Text>

      {nextAction && <Button title={nextAction} onPress={handleAdvanceStatus} loading={busy} />}

      {canEditItems && (
        <>
          <Subtitle>Agregar del menú</Subtitle>
          <FlatList
            style={{ marginTop: 8 }}
            data={availableItems}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleAdd(item)} disabled={busy}>
                <Card>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: colors.text }}>{item.name}</Text>
                    <Text style={{ color: colors.primary, fontWeight: "700" }}>+ ${item.price.toFixed(2)}</Text>
                  </View>
                </Card>
              </Pressable>
            )}
          />
        </>
      )}
    </Screen>
  );
}
