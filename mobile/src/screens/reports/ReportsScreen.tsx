import React, { useCallback, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ReportSummary, TopItem } from "../../types/models";
import * as reportsApi from "../../api/reports.api";
import { Screen, Title, Subtitle, Card, EmptyState, colors } from "../../components/ui";

export function ReportsScreen() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, topItemsData] = await Promise.all([
        reportsApi.getSummary(),
        reportsApi.getTopItems({ limit: 10 }),
      ]);
      setSummary(summaryData);
      setTopItems(topItemsData);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los reportes");
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
      <Title>Reportes</Title>
      <Subtitle>Resumen general del negocio</Subtitle>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 16, marginBottom: 8 }}>
        <Card style={{ flex: 1 }}>
          <Text style={{ color: colors.subtext }}>Ingresos</Text>
          <Text style={{ color: colors.success, fontSize: 20, fontWeight: "700" }}>
            ${(summary?.totalRevenue ?? 0).toFixed(2)}
          </Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text style={{ color: colors.subtext }}>Facturas</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>{summary?.invoiceCount ?? 0}</Text>
        </Card>
      </View>

      <Card>
        <Text style={{ color: colors.subtext }}>Ticket promedio</Text>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>
          ${(summary?.averageTicket ?? 0).toFixed(2)}
        </Text>
      </Card>

      <Subtitle>Platos más vendidos</Subtitle>
      <FlatList
        style={{ marginTop: 8 }}
        data={topItems}
        keyExtractor={(i) => i.menuItemId}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="Aún no hay ventas registradas" /> : null}
        renderItem={({ item, index }) => (
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {index + 1}. {item.name}
              </Text>
              <Text style={{ color: colors.subtext }}>{item.quantity} vendidos</Text>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}
