import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../services/api";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { formatCurrency, paginate } from "../utils/format";
import { exportToCSV } from "../utils/csv";
import { useToast } from "../context/ToastContext";

const PAGE_SIZE = 6;

const OrdersPage = () => {
  const { globalSearch, currentUser } = useOutletContext();
  const debouncedSearch = useDebounce(globalSearch);
  const { data, loading, error, refetch } = useFetch(() => api.getAll("orders"), []);
  const { showToast } = useToast();
  const canUpdateOrders = currentUser?.role === "Admin" || currentUser?.role === "Manager";
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return data.filter((order) => {
      const bySearch =
        String(order.id).includes(debouncedSearch) ||
        order.customer.toLowerCase().includes(debouncedSearch.toLowerCase());
      const byStatus = status === "All" ? true : order.status === status;
      return bySearch && byStatus;
    });
  }, [data, debouncedSearch, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = paginate(filtered, page, PAGE_SIZE);

  const handleStatusChange = async (id, nextStatus) => {
    await api.update("orders", id, { status: nextStatus });
    showToast("Order status updated");
    refetch();
  };

  if (loading) return <LoadingState label="Loading orders..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Orders Management</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              exportToCSV(filtered, "orders-export");
              showToast("Orders CSV exported", "info");
            }}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:text-gray-100"
          >
            Export CSV
          </button>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            <option>All</option><option>Pending</option><option>Shipping</option><option>Completed</option>
          </select>
        </div>
      </div>

      {!filtered.length ? (
        <EmptyState title="No orders found" />
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60">
                    <td className="px-4 py-3">#{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3">
                      {canUpdateOrders ? (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="rounded-lg border border-gray-200 px-2 py-1"
                        >
                          <option>Pending</option><option>Shipping</option><option>Completed</option>
                        </select>
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
            {paginated.map((order) => (
              <div key={order.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="font-medium dark:text-gray-100">#{order.id}</p>
                  <p className="text-sm dark:text-gray-200">{order.status}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{order.customer}</p>
                <p className="mt-1 text-sm dark:text-gray-200">{formatCurrency(order.totalPrice)}</p>
                {canUpdateOrders && (
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option>Pending</option><option>Shipping</option><option>Completed</option>
                  </select>
                )}
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
