const StatCard = ({ title, value }) => (
  <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

export default StatCard;
