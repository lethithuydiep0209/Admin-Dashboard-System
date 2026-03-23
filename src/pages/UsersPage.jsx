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
import { paginate } from "../utils/format";
import { validateEmail, validateRequired } from "../utils/validators";

const PAGE_SIZE = 5;
const defaultForm = { name: "", email: "", role: "User", status: "Active" };

const UsersPage = () => {
  const { globalSearch } = useOutletContext();
  const debouncedSearch = useDebounce(globalSearch);
  const { data, loading, error, refetch } = useFetch(() => api.getAll("users"), []);

  const [page, setPage] = useState(1);
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return data.filter((user) => {
      const bySearch =
        user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const byRole = role === "All" ? true : user.role === role;
      const byStatus = status === "All" ? true : user.status === status;
      return bySearch && byRole && byStatus;
    });
  }, [data, debouncedSearch, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = paginate(filtered, page, PAGE_SIZE);

  const openCreate = () => {
    setForm(defaultForm);
    setEditingId(null);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setForm({ name: row.name, email: row.email, role: row.role, status: row.status });
    setEditingId(row.id);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {
      name: validateRequired(form.name),
      email: validateEmail(form.email),
    };
    setFormErrors(errors);
    if (errors.name || errors.email) return;

    if (editingId) {
      await api.update("users", editingId, form);
    } else {
      await api.create("users", form);
    }
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id) => {
    await api.remove("users", id);
    refetch();
  };

  if (loading) return <LoadingState label="Loading users..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
        <button onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Add User
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option>All</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>User</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {!filtered.length ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.role}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(row)} className="text-primary hover:underline">Edit</button>
                        <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      {modalOpen && (
        <Modal title={editingId ? "Edit User" : "Add User"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Name</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm">Email</label>
              <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <option>Admin</option><option>Manager</option><option>User</option>
              </select>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2 text-sm text-white">{editingId ? "Update User" : "Create User"}</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
