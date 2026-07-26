export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TablesStackParamList = {
  Tables: undefined;
  Order: { tableId: string; orderId?: string };
};

export type MenuStackParamList = {
  MenuCategories: undefined;
  MenuItems: { categoryId: string; categoryName: string };
  MenuItemForm: { categoryId: string; categoryName?: string };
};

export type KitchenStackParamList = {
  KitchenQueue: undefined;
};

export type InvoicesStackParamList = {
  InvoiceList: undefined;
  CreateInvoice: { orderId: string };
};

export type ReportsStackParamList = {
  Reports: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Subscription: undefined;
};
