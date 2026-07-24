import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MenuStackParamList } from "../../navigation/types";
import { MenuCategory } from "../../types/models";
import * as menuApi from "../../api/menu.api";
import { Screen, Title, Subtitle, Card, Button, Input, EmptyState, colors } from "../../components/ui";

type Props = NativeStackScreenProps<MenuStackParamList, "MenuCategories">;

export function MenuCategoriesScreen({ navigation }: Props) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await menuApi.listCategories());
    } catch {
      Alert.alert("Error", "No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleCreate() {
    if (!newCategory.trim()) return;
    setCreating(true);
    try {
      await menuApi.createCategory({ name: newCategory.trim() });
      setNewCategory("");
      await load();
    } catch {
      Alert.alert("Error", "No se pudo crear la categoría");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Screen>
      <Title>Menú</Title>
      <Subtitle>Categorías del restaurante</Subtitle>

      <FlatList
        style={{ marginTop: 16 }}
        data={categories}
        keyExtractor={(c) => c.id}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="Aún no hay categorías" /> : null}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("MenuItems", { categoryId: item.id, categoryName: item.name })}>
            <Card>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
            </Card>
          </Pressable>
        )}
      />

      <Input placeholder="Nueva categoría (ej. Postres)" value={newCategory} onChangeText={setNewCategory} />
      <Button title="Agregar categoría" onPress={handleCreate} loading={creating} />
    </Screen>
  );
}
