import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../services/api";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import { formatCurrency, paginate } from "../utils/format";
import { validateNumber, validateRequired } from "../utils/validators";
import { exportToCSV } from "../utils/csv";
import { useToast } from "../context/ToastContext";

const PAGE_SIZE = 5;
const defaultForm = { image: "", name: "", price: "", category: "Electronics" };

const ProductsPage = () => {
  const { globalSearch, currentUser } = useOutletContext();
  const debouncedSearch = useDebounce(globalSearch);
  const { data, loading, error, refetch } = useFetch(() => api.getAll("products"), []);
  const { showToast } = useToast();
  const canManageProducts = currentUser?.role === "Admin" || currentUser?.role === "Manager";

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("none");
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let rows = data.filter((item) => {
      const bySearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const byCategory = category === "All" ? true : item.category === category;
      return bySearch && byCategory;
    });
    if (sort === "asc") rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === "desc") rows = [...rows].sort((a, b) => b.price - a.price);
    return rows;
  }, [data, debouncedSearch, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = paginate(filtered, page, PAGE_SIZE);

  const openCreate = () => {
    setForm(defaultForm);
    setEditingId(null);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setForm({ image: row.image, name: row.name, price: row.price, category: row.category });
    setEditingId(row.id);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {
      name: validateRequired(form.name),
      price: validateNumber(form.price, "Price"),
      category: validateRequired(form.category),
    };
    setFormErrors(errors);
    if (errors.name || errors.price || errors.category) return;

    const payload = { ...form, price: Number(form.price), image: form.image || "https://picsum.photos/seed/product/80" };
    if (editingId) {
      await api.update("products", editingId, payload);
      showToast("Product updated successfully");
    } else {
      await api.create("products", payload);
      showToast("Product created successfully");
    }
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id) => {
    await api.remove("products", id);
    showToast("Product deleted");
    refetch();
  };

  if (loading) return <LoadingState label="Loading products..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Products Management</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              exportToCSV(filtered, "products-export");
              showToast("Products CSV exported", "info");
            }}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:text-gray-100"
          >
            Export CSV
          </button>
          {canManageProducts && (
            <button onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Add Product
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option>All</option><option>Electronics</option><option>Furniture</option><option>Accessories</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option value="none">Sort by price</option><option value="asc">Price: Low to high</option><option value="desc">Price: High to low</option>
        </select>
      </div>

      {!filtered.length ? (
        <EmptyState title="No products found" />
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-4 py-3">Image</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60">
                    <td className="px-4 py-3"><img src={row.image} alt={row.name} className="h-10 w-10 rounded object-cover" /></td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{formatCurrency(row.price)}</td>
                    <td className="px-4 py-3">{row.category}</td>
                    <td className="px-4 py-3">
                      {canManageProducts ? (
                        <div className="flex gap-2"><button onClick={() => openEdit(row)} className="text-primary hover:underline">Edit</button><button onClick={() => handleDelete(row.id)} className="text-red-500 hover:underline">Delete</button></div>
                      ) : (
                        <span className="text-xs text-gray-400">Read only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 p-3 md:hidden">
            {paginated.map((row) => (
              <div key={row.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <img src={row.image} alt={row.name} className="h-12 w-12 rounded object-cover" />
                  <div>
                    <p className="font-medium dark:text-gray-100">{row.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{row.category}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm dark:text-gray-200">{formatCurrency(row.price)}</p>
                {canManageProducts && (
                  <div className="mt-2 flex gap-3 text-sm">
                    <button onClick={() => openEdit(row)} className="text-primary">Edit</button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-500">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      {modalOpen && (
        <Modal title={editingId ? "Edit Product" : "Add Product"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Product name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            <input placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {formErrors.price && <p className="text-xs text-red-500">{formErrors.price}</p>}
            <input placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option>Electronics</option><option>Furniture</option><option>Accessories</option>
            </select>
            <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2 text-sm text-white">{editingId ? "Update Product" : "Create Product"}</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProductsPage;
