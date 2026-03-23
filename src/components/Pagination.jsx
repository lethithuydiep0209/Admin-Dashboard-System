const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button
        type="button"
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
