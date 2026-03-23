const EmptyState = ({ title = "No data found", description = "Try changing filters or adding a new item." }) => (
  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
    <p className="text-base font-medium text-gray-800">{title}</p>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
  </div>
);

export default EmptyState;
