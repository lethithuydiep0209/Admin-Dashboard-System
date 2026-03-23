const ErrorState = ({ message, onRetry }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
    <p>{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="mt-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white">
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
