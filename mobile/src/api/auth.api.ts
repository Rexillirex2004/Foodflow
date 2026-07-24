import { client } from "./client";
import { Restaurant, Subscription, User } from "../types/models";

export interface AuthResponse {
  token: string;
  user: User;
  restaurant: Restaurant;
  subscription: Subscription;
}

export function login(email: string, password: string) {
  return client.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data);
}

export function register(input: {
  restaurantName: string;
  ownerName: string;
  email: string;
  password: string;
}) {
  return client.post<AuthResponse>("/auth/register", input).then((r) => r.data);
}

export function me() {
  return client
    .get<{ user: User; restaurant: Restaurant; subscription: Subscription }>("/auth/me")
    .then((r) => r.data);
}
