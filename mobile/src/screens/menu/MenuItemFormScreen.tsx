import React, { useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MenuStackParamList } from "../../navigation/types";
import * as menuApi from "../../api/menu.api";
import { Screen, Title, Input, Button, colors } from "../../components/ui";

type Props = NativeStackScreenProps<MenuStackParamList, "MenuItemForm">;

function sanitizePriceInput(text: string): string {
  const normalized = text.replace(",", ".").replace(/[^0-9.]/g, "");
  const firstDotIndex = normalized.indexOf(".");
  if (firstDotIndex === -1) return normalized;

  const integerPart = normalized.slice(0, firstDotIndex);
  const decimalPart = normalized.slice(firstDotIndex + 1).replace(/\./g, "").slice(0, 2);
  return `${integerPart}.${decimalPart}`;
}

const label = { color: colors.subtext, fontSize: 13, marginBottom: 6 };

export function MenuItemFormScreen({ route, navigation }: Props) {
  const { categoryId, categoryName } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  function handlePriceBlur() {
    if (!price) return;
    const parsed = Number(price);
    if (!Number.isNaN(parsed)) {
      setPrice(parsed.toFixed(2));
    }
  }

  async function handleSave() {
    const parsedPrice = Number(price);
    if (!name.trim() || !price || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("Datos incompletos", "Ingresa un nombre y un precio válido (ej. 9.99)");
      return;
    }

    setLoading(true);
    try {
      await menuApi.createItem({
        categoryId,
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(parsedPrice.toFixed(2)),
        available,
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
      <Title>Nuevo plato{categoryName ? ` en ${categoryName}` : ""}</Title>

      <Text style={[label, { marginTop: 24 }]}>Nombre del plato</Text>
      <Input placeholder="Ej. Fetuccini Alfredo" value={name} onChangeText={setName} />

      <Text style={label}>Descripción (opcional)</Text>
      <Input placeholder="Ej. Pasta en salsa cremosa con parmesano" value={description} onChangeText={setDescription} />

      <Text style={label}>Precio</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: colors.text, fontSize: 16, marginRight: 8 }}>$</Text>
        <Input
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={(text) => setPrice(sanitizePriceInput(text))}
          onBlur={handlePriceBlur}
          style={{ flex: 1 }}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4, marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontSize: 15 }}>Disponible</Text>
        <Switch
          value={available}
          onValueChange={setAvailable}
          trackColor={{ false: colors.border, true: colors.success }}
          thumbColor={colors.surface}
        />
      </View>

      <Button title="Guardar" onPress={handleSave} loading={loading} />
    </Screen>
  );
}
