import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loading from "../Components/Loading"

function LandingPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) return <Loading fullScreen />

  if (user) {
    navigate( "/dashboard", { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-canvas text-text-main flex flex-col items-center justify-center px-4 transition-colors duration-200">

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
        Smart Leads
      </h1>
      <p className="text-text-muted text-sm sm:text-base mb-10">
        Manage your pipeline and close deals faster.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-sm">
        <button
          onClick={() => navigate("/login/admin")}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Login as Admin
        </button>
        <button
          onClick={() => navigate("/login/sales")}
          className="flex-1 bg-surface border border-border-muted hover:border-border-strong text-text-main font-semibold py-3 px-6 rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Login as Sales
        </button>
      </div>

      <p className="mt-5 text-sm text-text-muted">
        New sales member?{" "}
        <a
          href="/signup"
          className="font-semibold text-text-main hover:underline transition-all"
        >
          Create an account
        </a>
      </p>

    </div>
  )
}

export default LandingPage