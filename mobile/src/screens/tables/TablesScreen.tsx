import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { TablesStackParamList } from "../../navigation/types";
import { OrderStatus, Table } from "../../types/models";
import * as tablesApi from "../../api/tables.api";
import * as ordersApi from "../../api/orders.api";
import { Screen, Title, Subtitle, Card, StatusTag, EmptyState, colors } from "../../components/ui";

type Props = NativeStackScreenProps<TablesStackParamList, "Tables">;

// La mesa solo tiene FREE/OCCUPIED en la base de datos; el estado que se ve
// en cada tarjeta (Ocupada / En preparación / Lista para cobrar) se deriva
// del pedido activo de esa mesa, solo para mostrarlo con más claridad.
type DisplayStatus = "FREE" | "WAITING_FOR_ORDER" | "TAKING_ORDER" | "IN_PROGRESS" | "READY_TO_PAY";

const STATUS_META: Record<
  DisplayStatus,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  FREE: { label: "Libre", color: colors.success, icon: "checkmark-circle-outline" },
  WAITING_FOR_ORDER: { label: "Esperando pedido", color: colors.subtext, icon: "time-outline" },
  TAKING_ORDER: { label: "Ocupada", color: colors.danger, icon: "people-outline" },
  IN_PROGRESS: { label: "En preparación", color: colors.warning, icon: "flame-outline" },
  READY_TO_PAY: { label: "Lista para cobrar", color: colors.primary, icon: "cash-outline" },
};

function getDisplayStatus(table: Table, orderStatus?: OrderStatus, orderItemCount?: number): DisplayStatus {
  if (table.status === "FREE" || !orderStatus) return "FREE";
  if (orderStatus === "OPEN" && (orderItemCount ?? 0) === 0) return "WAITING_FOR_ORDER";
  if (orderStatus === "IN_PROGRESS") return "IN_PROGRESS";
  if (orderStatus === "READY" || orderStatus === "SERVED") return "READY_TO_PAY";
  return "TAKING_ORDER";
}

export function TablesScreen({ navigation }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [orderStatusByTable, setOrderStatusByTable] = useState<Record<string, OrderStatus>>({});
  const [orderItemCountByTable, setOrderItemCountByTable] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tablesData, activeOrderLists] = await Promise.all([
        tablesApi.listTables(),
        Promise.all([
          ordersApi.listOrders({ status: "OPEN" }),
          ordersApi.listOrders({ status: "IN_PROGRESS" }),
          ordersApi.listOrders({ status: "READY" }),
          ordersApi.listOrders({ status: "SERVED" }),
        ]),
      ]);
      setTables(tablesData);
      const statusMap: Record<string, OrderStatus> = {};
      const itemCountMap: Record<string, number> = {};
      for (const list of activeOrderLists) {
        for (const order of list) {
          statusMap[order.tableId] = order.status;
          itemCountMap[order.tableId] = order.items.length;
        }
      }
      setOrderStatusByTable(statusMap);
      setOrderItemCountByTable(itemCountMap);
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

  const counts = tables.reduce((acc, table) => {
    const status = getDisplayStatus(table, orderStatusByTable[table.id], orderItemCountByTable[table.id]);
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {} as Record<DisplayStatus, number>);

  return (
    <Screen>
      <Title>Mesas</Title>
      <Subtitle>Toca una mesa para tomar o continuar su pedido</Subtitle>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        {(Object.keys(STATUS_META) as DisplayStatus[]).map((key) =>
          counts[key] ? (
            <View
              key={key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: STATUS_META[key].color }} />
              <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}>
                {counts[key]} {STATUS_META[key].label}
              </Text>
            </View>
          ) : null
        )}
      </View>

      <FlatList
        style={{ marginTop: 12 }}
        data={tables}
        keyExtractor={(t) => t.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="Aún no hay mesas configuradas" /> : null}
        renderItem={({ item }) => {
          const status = getDisplayStatus(item, orderStatusByTable[item.id], orderItemCountByTable[item.id]);
          const meta = STATUS_META[status];
          return (
            <Pressable style={{ flex: 1 }} onPress={() => handlePress(item)}>
              <Card style={{ borderLeftWidth: 4, borderLeftColor: meta.color }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View>
                    <Text style={{ color: colors.text, fontSize: 18, fontFamily: "Poppins_600SemiBold" }}>
                      {item.name}
                    </Text>
                    {!!item.capacity && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <Ionicons name="people-outline" size={14} color={colors.subtext} />
                        <Text style={{ color: colors.subtext, fontSize: 13 }}>{item.capacity} personas</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name={meta.icon} size={22} color={meta.color} />
                </View>
                <View style={{ marginTop: 14 }}>
                  <StatusTag label={meta.label} color={meta.color} />
                </View>
              </Card>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
