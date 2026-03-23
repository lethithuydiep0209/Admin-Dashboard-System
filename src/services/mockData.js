export const seedUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@company.com", role: "Admin", status: "Active" },
  { id: 2, name: "Brian Smith", email: "brian@company.com", role: "Manager", status: "Active" },
  { id: 3, name: "Cathy Green", email: "cathy@company.com", role: "User", status: "Inactive" },
  { id: 4, name: "Daniel Moore", email: "daniel@company.com", role: "User", status: "Active" },
  { id: 5, name: "Emma Davis", email: "emma@company.com", role: "Manager", status: "Active" },
  { id: 6, name: "Frank Lee", email: "frank@company.com", role: "User", status: "Inactive" },
];

export const seedProducts = [
  { id: 1, image: "https://picsum.photos/seed/laptop/80", name: "Business Laptop", price: 1299, category: "Electronics" },
  { id: 2, image: "https://picsum.photos/seed/chair/80", name: "Office Chair", price: 199, category: "Furniture" },
  { id: 3, image: "https://picsum.photos/seed/mouse/80", name: "Wireless Mouse", price: 49, category: "Accessories" },
  { id: 4, image: "https://picsum.photos/seed/desk/80", name: "Standing Desk", price: 499, category: "Furniture" },
  { id: 5, image: "https://picsum.photos/seed/headset/80", name: "Call Headset", price: 89, category: "Accessories" },
];

export const seedOrders = [
  { id: 1001, customer: "Alice Johnson", totalPrice: 1348, status: "Completed", createdAt: "2026-03-10" },
  { id: 1002, customer: "Brian Smith", totalPrice: 199, status: "Pending", createdAt: "2026-03-13" },
  { id: 1003, customer: "Cathy Green", totalPrice: 588, status: "Shipping", createdAt: "2026-03-15" },
  { id: 1004, customer: "Daniel Moore", totalPrice: 89, status: "Completed", createdAt: "2026-03-18" },
  { id: 1005, customer: "Emma Davis", totalPrice: 499, status: "Pending", createdAt: "2026-03-20" },
];
