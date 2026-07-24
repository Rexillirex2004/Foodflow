import React, { useState } from "react";
import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MenuStackParamList } from "../../navigation/types";
import * as menuApi from "../../api/menu.api";
import { Screen, Title, Input, Button } from "../../components/ui";

type Props = NativeStackScreenProps<MenuStackParamList, "MenuItemForm">;

export function MenuItemFormScreen({ route, navigation }: Props) {
  const { categoryId } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    const parsedPrice = Number(price.replace(",", "."));
    if (!name.trim() || !parsedPrice || parsedPrice <= 0) {
      Alert.alert("Datos incompletos", "Ingresa un nombre y un precio válido");
      return;
    }

    setLoading(true);
    try {
      await menuApi.createItem({
        categoryId,
        name: name.trim(),
        description: description.trim() || undefined,
        price: parsedPrice,
      });
      navigation.goBack();
    } catch {
      Alert.alert("Error", "No se pudo crear el plato");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title>Nuevo plato</Title>
      <Input placeholder="Nombre" value={name} onChangeText={setName} style={{ marginTop: 24 }} />
      <Input placeholder="Descripción (opcional)" value={description} onChangeText={setDescription} />
      <Input placeholder="Precio" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
      <Button title="Guardar" onPress={handleSave} loading={loading} />
    </Screen>
  );
}
