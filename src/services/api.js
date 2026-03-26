import { getCollection, setCollection } from "./storage";

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const nextId = (items) => {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => Number(item.id))) + 1;
};

const withHandling = async (handler) => {
  try {
    await sleep();
    return await handler();
  } catch (error) {
    const message = error?.message || "Unexpected error occurred";
    throw new Error(message);
  }
};

export const api = {
  async login(email, password) {
    return withHandling(async () => {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const normalized = email.toLowerCase();
      const role = normalized.includes("manager") ? "Manager" : normalized.includes("user") ? "User" : "Admin";
      return {
        id: 1,
        name: "Admin User",
        email,
        role,
      };
    });
  },

  async getAll(resource) {
    return withHandling(() => getCollection(resource));
  },

  async create(resource, payload) {
    return withHandling(() => {
      const data = getCollection(resource);
      const newItem = { ...payload, id: nextId(data) };
      const updated = [newItem, ...data];
      setCollection(resource, updated);
      return newItem;
    });
  },

  async update(resource, id, payload) {
    return withHandling(() => {
      const data = getCollection(resource);
      const updated = data.map((item) => (item.id === id ? { ...item, ...payload } : item));
      setCollection(resource, updated);
      return updated.find((item) => item.id === id);
    });
  },

  async remove(resource, id) {
    return withHandling(() => {
      const data = getCollection(resource);
      const updated = data.filter((item) => item.id !== id);
      setCollection(resource, updated);
      return { success: true };
    });
  },
};
