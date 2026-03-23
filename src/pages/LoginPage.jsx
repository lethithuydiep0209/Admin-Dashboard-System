import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setAuthUser } from "../services/storage";
import { validateEmail, validateRequired } from "../utils/validators";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(form.email),
      password: validateRequired(form.password),
    };
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) return;

    try {
      setLoading(true);
      setApiError("");
      const user = await api.login(form.email, form.password);
      setAuthUser(user);
      navigate("/");
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to access your dashboard.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700">Email</label>
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
              placeholder="admin@company.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
              placeholder="Enter password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
        </div>

        {apiError && <p className="mt-3 text-sm text-red-500">{apiError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
