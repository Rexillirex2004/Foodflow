import React, { useCallback, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Order } from "../../types/models";
import * as ordersApi from "../../api/orders.api";
import { Screen, Title, Subtitle, Card, Button, EmptyState, colors } from "../../components/ui";

export function KitchenQueueScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await ordersApi.listOrders({ status: "IN_PROGRESS" }));
    } catch {
      Alert.alert("Error", "No se pudieron cargar los pedidos de cocina");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function markReady(order: Order) {
    setBusyId(order.id);
    try {
      await ordersApi.updateOrderStatus(order.id, "READY");
      await load();
    } catch {
      Alert.alert("Error", "No se pudo marcar el pedido como listo");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Screen>
      <Title>Cocina</Title>
      <Subtitle>Pedidos enviados a preparar</Subtitle>

      <FlatList
        style={{ marginTop: 16 }}
        data={orders}
        keyExtractor={(o) => o.id}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="No hay pedidos pendientes" /> : null}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>{item.table.name}</Text>
            {item.items.map((oi) => (
              <View key={oi.id} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                <Text style={{ color: colors.subtext }}>
                  {oi.quantity}x {oi.menuItem.name}
                </Text>
              </View>
            ))}
            <Button title="Marcar como listo" onPress={() => markReady(item)} loading={busyId === item.id} />
          </Card>
        )}
      />
    </Screen>
  );
}
