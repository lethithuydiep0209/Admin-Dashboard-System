import { seedOrders, seedProducts, seedUsers } from "./mockData";

const KEYS = {
  users: "admin_users",
  products: "admin_products",
  orders: "admin_orders",
  auth: "admin_auth_user",
};

const parseJSON = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const setIfMissing = (key, value) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const initializeStorage = () => {
  setIfMissing(KEYS.users, seedUsers);
  setIfMissing(KEYS.products, seedProducts);
  setIfMissing(KEYS.orders, seedOrders);
};

export const getCollection = (key) => parseJSON(localStorage.getItem(KEYS[key]), []);

export const setCollection = (key, data) => {
  localStorage.setItem(KEYS[key], JSON.stringify(data));
};

export const getAuthUser = () => parseJSON(localStorage.getItem(KEYS.auth), null);

export const setAuthUser = (user) => {
  localStorage.setItem(KEYS.auth, JSON.stringify(user));
};

export const clearAuthUser = () => {
  localStorage.removeItem(KEYS.auth);
};
