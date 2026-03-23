const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button type="button" onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100">
          x
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
