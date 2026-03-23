export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );

export const paginate = (items, page, perPage) => {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};
