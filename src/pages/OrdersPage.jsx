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

const PAGE_SIZE = 6;

const OrdersPage = () => {
  const { globalSearch } = useOutletContext();
  const debouncedSearch = useDebounce(globalSearch);
  const { data, loading, error, refetch } = useFetch(() => api.getAll("orders"), []);
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
    refetch();
  };

  if (loading) return <LoadingState label="Loading orders..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Orders Management</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option>All</option><option>Pending</option><option>Shipping</option><option>Completed</option>
        </select>
      </div>

      {!filtered.length ? (
        <EmptyState title="No orders found" />
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">#{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="rounded-lg border border-gray-200 px-2 py-1"
                      >
                        <option>Pending</option><option>Shipping</option><option>Completed</option>
                      </select>
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
    </div>
  );
};

export default OrdersPage;
