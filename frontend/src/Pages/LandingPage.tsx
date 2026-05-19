import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6 text-text-main transition-colors duration-200">
      
      {/*  TITLE */}
      <h1 className="text-4xl font-bold tracking-tight text-text-main mb-2">
        Smart Leads
      </h1>

      <p className="text-text-muted mb-10 text-center text-sm sm:text-base max-w-xs sm:max-w-none">
        Manage your leads efficiently with role-based access
      </p>

      {/* LOGIN PORTAL */}
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* ADMIN PORTAL ACTION LINK */}
        <Link to="/login/admin">
          <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.99] transition shadow-sm cursor-pointer">
            Login as Admin
          </button>
        </Link>

        {/* USER PORTAL ACTION LINK */}
        <Link to="/login/sales">
          <button className="w-full py-3 rounded-xl border border-border-strong bg-surface text-text-main font-semibold hover:bg-input-bg/70 active:scale-[0.99] transition shadow-sm cursor-pointer">
            Login as Sales
          </button>
        </Link>

      </div>

    
      <p className="mt-8 text-sm text-text-muted">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-500 font-semibold hover:underline transition-colors ms-1">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LandingPage