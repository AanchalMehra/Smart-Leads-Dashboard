import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Loading from "../Components/Loading";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import type { SignupFormData } from "../types/auth.types";

//api type
type SignupResponse = {
  success: boolean;
  message?: string;
  token?: string;
};

function SignupPage() {
  const [form, setForm] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as keyof SignupFormData]: value,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Type-safe Axios POST request passing 'SignupFormData' structure and matching 'SignupResponse'
      await api.post<SignupResponse>("/auth/signup", form);
      navigate("/login/sales");
    } catch (err: unknown) {
      let message = "Signup failed";

      if (err instanceof AxiosError) {
        message = err.response?.data?.message || err.message || "Signup failed";
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all duration-200">
        
        <div className="mb-5">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Get started with your Sales team account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl text-sm font-medium animate-fadeIn">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black hover:bg-slate-800 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none mt-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link 
                to="/login/sales" 
                className="font-semibold text-black hover:underline transition-all"
              >
                Log in here
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}

export default SignupPage;