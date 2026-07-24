import { client } from "./client";
import { Subscription } from "../types/models";

export function getSubscription() {
  return client.get<Subscription>("/subscription").then((r) => r.data);
}

export function paySubscription() {
  return client.post<Subscription>("/subscription/pay").then((r) => r.data);
}
