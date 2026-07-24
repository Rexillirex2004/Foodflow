import React, { useCallback, useState } from "react";
import { Alert, FlatList, Switch, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MenuStackParamList } from "../../navigation/types";
import { MenuItem } from "../../types/models";
import * as menuApi from "../../api/menu.api";
import { Screen, Card, Button, EmptyState, colors } from "../../components/ui";

type Props = NativeStackScreenProps<MenuStackParamList, "MenuItems">;

export function MenuItemsScreen({ route, navigation }: Props) {
  const { categoryId } = route.params;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await menuApi.listItems(categoryId));
    } catch {
      Alert.alert("Error", "No se pudieron cargar los platos");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function toggleAvailability(item: MenuItem) {
    try {
      await menuApi.setItemAvailability(item.id, !item.available);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i)));
    } catch {
      Alert.alert("Error", "No se pudo actualizar la disponibilidad");
    }
  }

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="Aún no hay platos en esta categoría" /> : null}
        renderItem={({ item }) => (
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
                {!!item.description && <Text style={{ color: colors.subtext, marginTop: 2 }}>{item.description}</Text>}
                <Text style={{ color: colors.primary, marginTop: 6, fontWeight: "700" }}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
              <Switch value={item.available} onValueChange={() => toggleAvailability(item)} />
            </View>
          </Card>
        )}
      />

      <Button title="Agregar plato" onPress={() => navigation.navigate("MenuItemForm", { categoryId })} />
    </Screen>
  );
}
