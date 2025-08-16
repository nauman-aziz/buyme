"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number; // store in cents if you like
  qty: number;
};

const STORAGE_KEY = "gearhub_cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  // notify other tabs/components
  window.dispatchEvent(new Event("cart:updated"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // load once and subscribe to changes (storage & custom event)
  useEffect(() => {
    setItems(readCart());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readCart());
    };
    const onCartUpdated = () => setItems(readCart());

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:updated", onCartUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:updated", onCartUpdated);
    };
  }, []);

  // derived values
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + (i.qty || 0), 0),
    [items]
  );
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  // actions (optional for later use)
  const addItem = (item: CartItem) => {
    const next = [...items];
    const idx = next.findIndex((i) => i.id === item.id);
    if (idx >= 0) next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
    else next.push(item);
    writeCart(next);
    setItems(next);
  };

  const removeItem = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    writeCart(next);
    setItems(next);
  };

  const updateQty = (id: string, qty: number) => {
    const next = items.map((i) => (i.id === id ? { ...i, qty } : i));
    writeCart(next);
    setItems(next);
  };

  const clear = () => {
    writeCart([]);
    setItems([]);
  };

  return { items, itemCount, total, addItem, removeItem, updateQty, clear };
}
