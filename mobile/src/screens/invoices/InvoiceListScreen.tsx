import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InvoicesStackParamList } from "../../navigation/types";
import { Invoice, Order } from "../../types/models";
import * as ordersApi from "../../api/orders.api";
import * as invoicesApi from "../../api/invoices.api";
import { Screen, Title, Subtitle, Card, EmptyState, colors } from "../../components/ui";

type Props = NativeStackScreenProps<InvoicesStackParamList, "InvoiceList">;

export function InvoiceListScreen({ navigation }: Props) {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ready, served, invoiceHistory] = await Promise.all([
        ordersApi.listOrders({ status: "READY" }),
        ordersApi.listOrders({ status: "SERVED" }),
        invoicesApi.listInvoices(),
      ]);
      setPendingOrders([...ready, ...served]);
      setInvoices(invoiceHistory);
    } catch {
      Alert.alert("Error", "No se pudieron cargar las ventas");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <Screen>
      <Title>Ventas</Title>
      <Subtitle>Pedidos por cobrar</Subtitle>

      <FlatList
        style={{ maxHeight: 220, marginTop: 12 }}
        data={pendingOrders}
        keyExtractor={(o) => o.id}
        ListEmptyComponent={!loading ? <EmptyState text="No hay pedidos pendientes de cobro" /> : null}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("CreateInvoice", { orderId: item.id })}>
            <Card>
              <Text style={{ color: colors.text, fontWeight: "700" }}>{item.table.name}</Text>
              <Text style={{ color: colors.subtext }}>
                {item.items.length} {item.items.length === 1 ? "producto" : "productos"} · toca para cobrar
              </Text>
            </Card>
          </Pressable>
        )}
      />

      <Subtitle>Historial</Subtitle>
      <FlatList
        style={{ marginTop: 8 }}
        data={invoices}
        keyExtractor={(i) => i.id}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="Aún no hay facturas" /> : null}
        renderItem={({ item }) => (
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>Factura #{item.invoiceNumber}</Text>
              <Text style={{ color: colors.success, fontWeight: "700" }}>${item.total.toFixed(2)}</Text>
            </View>
            <Text style={{ color: colors.subtext, marginTop: 2 }}>
              {item.order.table.name} · {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}
