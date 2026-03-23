const LoadingState = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center rounded-xl bg-white p-10 shadow-sm ring-1 ring-gray-200">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    <span className="ml-3 text-sm text-gray-600">{label}</span>
  </div>
);

export default LoadingState;
