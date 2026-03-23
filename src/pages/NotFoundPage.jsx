import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-page px-4">
    <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm text-white">
        Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
