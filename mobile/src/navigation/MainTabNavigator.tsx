import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors } from "../components/ui";
import {
  TablesStackParamList,
  MenuStackParamList,
  KitchenStackParamList,
  InvoicesStackParamList,
  ReportsStackParamList,
  ProfileStackParamList,
} from "./types";

import { TablesScreen } from "../screens/tables/TablesScreen";
import { OrderScreen } from "../screens/orders/OrderScreen";

import { MenuCategoriesScreen } from "../screens/menu/MenuCategoriesScreen";
import { MenuItemsScreen } from "../screens/menu/MenuItemsScreen";
import { MenuItemFormScreen } from "../screens/menu/MenuItemFormScreen";

import { KitchenQueueScreen } from "../screens/orders/KitchenQueueScreen";

import { InvoiceListScreen } from "../screens/invoices/InvoiceListScreen";
import { CreateInvoiceScreen } from "../screens/invoices/CreateInvoiceScreen";

import { ReportsScreen } from "../screens/reports/ReportsScreen";

import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { SubscriptionScreen } from "../screens/subscription/SubscriptionScreen";

const TablesStackNav = createNativeStackNavigator<TablesStackParamList>();
function TablesStack() {
  return (
    <TablesStackNav.Navigator>
      <TablesStackNav.Screen name="Tables" component={TablesScreen} options={{ title: "Mesas" }} />
      <TablesStackNav.Screen name="Order" component={OrderScreen} options={{ title: "Pedido" }} />
    </TablesStackNav.Navigator>
  );
}

const MenuStackNav = createNativeStackNavigator<MenuStackParamList>();
function MenuStack() {
  return (
    <MenuStackNav.Navigator>
      <MenuStackNav.Screen name="MenuCategories" component={MenuCategoriesScreen} options={{ title: "Menú" }} />
      <MenuStackNav.Screen
        name="MenuItems"
        component={MenuItemsScreen}
        options={({ route }) => ({ title: route.params.categoryName })}
      />
      <MenuStackNav.Screen name="MenuItemForm" component={MenuItemFormScreen} options={{ title: "Nuevo plato" }} />
    </MenuStackNav.Navigator>
  );
}

const KitchenStackNav = createNativeStackNavigator<KitchenStackParamList>();
function KitchenStack() {
  return (
    <KitchenStackNav.Navigator>
      <KitchenStackNav.Screen name="KitchenQueue" component={KitchenQueueScreen} options={{ title: "Cocina" }} />
    </KitchenStackNav.Navigator>
  );
}

const InvoicesStackNav = createNativeStackNavigator<InvoicesStackParamList>();
function InvoicesStack() {
  return (
    <InvoicesStackNav.Navigator>
      <InvoicesStackNav.Screen name="InvoiceList" component={InvoiceListScreen} options={{ title: "Ventas" }} />
      <InvoicesStackNav.Screen
        name="CreateInvoice"
        component={CreateInvoiceScreen}
        options={{ title: "Cobrar" }}
      />
    </InvoicesStackNav.Navigator>
  );
}

const ReportsStackNav = createNativeStackNavigator<ReportsStackParamList>();
function ReportsStack() {
  return (
    <ReportsStackNav.Navigator>
      <ReportsStackNav.Screen name="Reports" component={ReportsScreen} options={{ title: "Reportes" }} />
    </ReportsStackNav.Navigator>
  );
}

const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
      <ProfileStackNav.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ title: "Suscripción" }}
      />
    </ProfileStackNav.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { outline: keyof typeof Ionicons.glyphMap; filled: keyof typeof Ionicons.glyphMap }> = {
  MesasTab: { outline: "restaurant-outline", filled: "restaurant" },
  MenuTab: { outline: "book-outline", filled: "book" },
  CocinaTab: { outline: "flame-outline", filled: "flame" },
  VentasTab: { outline: "cash-outline", filled: "cash" },
  ReportesTab: { outline: "bar-chart-outline", filled: "bar-chart" },
  PerfilTab: { outline: "person-circle-outline", filled: "person-circle" },
};

export function MainTabNavigator() {
  const { user } = useAuth();
  const role = user?.role;

  const canSeeSales = role === "CASHIER" || role === "OWNER" || role === "ADMIN";
  const canSeeReports = role === "OWNER" || role === "ADMIN";
  const canSeeKitchen = role === "KITCHEN" || role === "OWNER" || role === "ADMIN";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#C9B79E",
        tabBarStyle: { backgroundColor: colors.wood, borderTopWidth: 0, height: 72, paddingBottom: 10, paddingTop: 10 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 2 },
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <View
              style={{
                width: 44,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "rgba(219,123,63,0.20)" : "transparent",
              }}
            >
              <Ionicons name={focused ? icons.filled : icons.outline} size={26} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="MesasTab"
        component={TablesStack}
        options={{ title: "Mesas" }}
        listeners={({ navigation }) => ({
          tabPress: () => navigation.navigate("MesasTab", { screen: "Tables" }),
        })}
      />
      <Tab.Screen name="MenuTab" component={MenuStack} options={{ title: "Menú" }} />
      {canSeeKitchen && <Tab.Screen name="CocinaTab" component={KitchenStack} options={{ title: "Cocina" }} />}
      {canSeeSales && (
        <Tab.Screen
          name="VentasTab"
          component={InvoicesStack}
          options={{ title: "Ventas" }}
          listeners={({ navigation }) => ({
            tabPress: () => navigation.navigate("VentasTab", { screen: "InvoiceList" }),
          })}
        />
      )}
      {canSeeReports && (
        <Tab.Screen name="ReportesTab" component={ReportsStack} options={{ title: "Reportes" }} />
      )}
      <Tab.Screen name="PerfilTab" component={ProfileStack} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}
