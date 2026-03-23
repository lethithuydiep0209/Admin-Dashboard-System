import { useMemo } from "react";
import { api } from "../services/api";
import { useFetch } from "../hooks/useFetch";
import { formatCurrency } from "../utils/format";
import StatCard from "../components/StatCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const DashboardPage = () => {
  const usersQuery = useFetch(() => api.getAll("users"), []);
  const productsQuery = useFetch(() => api.getAll("products"), []);
  const ordersQuery = useFetch(() => api.getAll("orders"), []);

  const loading = usersQuery.loading || productsQuery.loading || ordersQuery.loading;
  const error = usersQuery.error || productsQuery.error || ordersQuery.error;

  const revenue = useMemo(
    () => ordersQuery.data.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0),
    [ordersQuery.data]
  );

  if (loading) return <LoadingState label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={ordersQuery.refetch} />;

  const recentOrders = [...ordersQuery.data].slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Users" value={usersQuery.data.length} />
        <StatCard title="Total Orders" value={ordersQuery.data.length} />
        <StatCard title="Total Revenue" value={formatCurrency(revenue)} />
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Orders by Status</h2>
        <div className="mt-4 space-y-3">
          {["Pending", "Shipping", "Completed"].map((status) => {
            const count = ordersQuery.data.filter((item) => item.status === status).length;
            const max = Math.max(ordersQuery.data.length, 1);
            const width = (count / max) * 100;
            return (
              <div key={status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{status}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[540px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2">Order ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total Price</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2">#{order.id}</td>
                  <td className="py-2">{order.customer}</td>
                  <td className="py-2">{formatCurrency(order.totalPrice)}</td>
                  <td className="py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
