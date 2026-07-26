import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import * as TokenStorage from "../api/tokenStorage";
import { TOKEN_KEY } from "../api/client";
import * as authApi from "../api/auth.api";
import * as subscriptionApi from "../api/subscription.api";
import { on } from "../api/authEvents";
import { Restaurant, Subscription, User } from "../types/models";

function isSubscriptionUsable(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  const now = new Date();

  if (subscription.status === "TRIAL") {
    return new Date(subscription.trialEndsAt) > now;
  }
  if (subscription.status === "ACTIVE") {
    return !!subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd) > now;
  }
  return false;
}

interface AuthContextValue {
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  user: User | null;
  restaurant: Restaurant | null;
  subscription: Subscription | null;
  isSubscriptionUsable: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { restaurantName: string; ownerName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  payMockSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const clearSession = useCallback(async () => {
    await TokenStorage.deleteItemAsync(TOKEN_KEY);
    setUser(null);
    setRestaurant(null);
    setSubscription(null);
  }, []);

  useEffect(() => {
    (async () => {
      const token = await TokenStorage.getItemAsync(TOKEN_KEY);
      if (token) {
        try {
          const data = await authApi.me();
          setUser(data.user);
          setRestaurant(data.restaurant);
          setSubscription(data.subscription);
        } catch {
          await clearSession();
        }
      }
      setIsBootstrapping(false);
    })();
  }, [clearSession]);

  useEffect(() => {
    const offUnauthorized = on("unauthorized", () => {
      clearSession();
    });
    const offSubscriptionInactive = on("subscription-inactive", (payload) => {
      if (payload) setSubscription(payload as Subscription);
    });
    return () => {
      offUnauthorized();
      offSubscriptionInactive();
    };
  }, [clearSession]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    await TokenStorage.setItemAsync(TOKEN_KEY, data.token);
    setUser(data.user);
    setRestaurant(data.restaurant);
    setSubscription(data.subscription);
  }, []);

  const register = useCallback(
    async (input: { restaurantName: string; ownerName: string; email: string; password: string }) => {
      const data = await authApi.register(input);
      await TokenStorage.setItemAsync(TOKEN_KEY, data.token);
      setUser(data.user);
      setRestaurant(data.restaurant);
      setSubscription(data.subscription);
    },
    []
  );

  const logout = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  const refreshSubscription = useCallback(async () => {
    const data = await subscriptionApi.getSubscription();
    setSubscription(data);
  }, []);

  const payMockSubscription = useCallback(async () => {
    const data = await subscriptionApi.paySubscription();
    setSubscription(data);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isBootstrapping,
      isAuthenticated: !!user,
      user,
      restaurant,
      subscription,
      isSubscriptionUsable: isSubscriptionUsable(subscription),
      login,
      register,
      logout,
      refreshSubscription,
      payMockSubscription,
    }),
    [isBootstrapping, user, restaurant, subscription, login, register, logout, refreshSubscription, payMockSubscription]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
