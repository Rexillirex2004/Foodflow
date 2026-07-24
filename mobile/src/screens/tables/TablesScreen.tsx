import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TablesStackParamList } from "../../navigation/types";
import { Table, TableStatus } from "../../types/models";
import * as tablesApi from "../../api/tables.api";
import * as ordersApi from "../../api/orders.api";
import { Screen, Title, Subtitle, Card, EmptyState, colors } from "../../components/ui";

type Props = NativeStackScreenProps<TablesStackParamList, "Tables">;

const STATUS_COLOR: Record<TableStatus, string> = {
  FREE: colors.primary,
  OCCUPIED: colors.danger,
  PENDING_PAYMENT: colors.warning,
};

const STATUS_LABEL: Record<TableStatus, string> = {
  FREE: "Libre",
  OCCUPIED: "Ocupada",
  PENDING_PAYMENT: "Por cobrar",
};

export function TablesScreen({ navigation }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTables(await tablesApi.listTables());
    } catch {
      Alert.alert("Error", "No se pudieron cargar las mesas");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handlePress(table: Table) {
    if (table.status === "FREE") {
      try {
        const order = await ordersApi.createOrder(table.id);
        navigation.navigate("Order", { tableId: table.id, orderId: order.id });
      } catch {
        Alert.alert("Error", "No se pudo abrir la mesa");
      }
      return;
    }

    try {
      const orders = await ordersApi.listOrders({ tableId: table.id });
      const openOrder = orders.find((o) => o.status !== "CLOSED" && o.status !== "CANCELLED");
      if (openOrder) {
        navigation.navigate("Order", { tableId: table.id, orderId: openOrder.id });
      } else {
        Alert.alert("Sin pedido activo", "Esta mesa no tiene un pedido abierto");
      }
    } catch {
      Alert.alert("Error", "No se pudo abrir el pedido de la mesa");
    }
  }

  return (
    <Screen>
      <Title>Mesas</Title>
      <Subtitle>Toca una mesa para tomar o continuar su pedido</Subtitle>

      <FlatList
        style={{ marginTop: 16 }}
        data={tables}
        keyExtractor={(t) => t.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="Aún no hay mesas configuradas" /> : null}
        renderItem={({ item }) => (
          <Pressable style={{ flex: 1 }} onPress={() => handlePress(item)}>
            <Card>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>{item.name}</Text>
              {!!item.capacity && <Text style={{ color: colors.subtext }}>{item.capacity} personas</Text>}
              <Text style={{ color: STATUS_COLOR[item.status], marginTop: 8, fontWeight: "700" }}>
                {STATUS_LABEL[item.status]}
              </Text>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
