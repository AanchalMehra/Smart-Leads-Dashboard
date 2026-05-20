import { useState } from "react"
import { Link , useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { LoginFormProps } from "../types/auth.types"
import { AxiosError } from "axios"
import { ArrowLeft } from "lucide-react"

function LoginForm({ role, title, subtitle }: LoginFormProps){
  const {login,logout}= useAuth()
  const navigate= useNavigate()

  const [email,setEmail]= useState<string>("")
  const [password, setPassword ]= useState<string>("")
  const [loading,setLoading]= useState<boolean>(false)
  const [error,setError]= useState<string>("")

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setLoading(true)
    setError("")

    try{
      const loggedInUser= await login(email, password, role)

      //  ROLE VERIFICATION 
      if(loggedInUser.role!== role){
        logout() 
        setError(`Access denied. You are trying to log in as an administrator using a ${loggedInUser.role} account.`)
        return
      }
      navigate("/dashboard")
      
    } 
    catch(error:unknown){
      let message = "Login failed"
      if (error instanceof AxiosError){
        message = error.response?.data?.message || error.message || message
      } 
      else if(error instanceof Error){
        message = error.message
      }
      setError(message)
    } 
    finally{
      setLoading(false)
    }
  }

  return(
    <div className="flex flex-col items-center justify-center min-h-screen bg-canvas px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="w-full max-w-md bg-surface p-6 sm:p-8 rounded-2xl border border-border-muted shadow-sm">
        
        <div className="mb-5">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
            {title}
          </h1>
          <p className="text-text-muted text-sm mt-1.5">
            {subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error &&(
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3.5 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted tracking-wide uppercase">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full border border-border-strong p-3 rounded-xl bg-input-bg text-text-main placeholder-text-muted focus:bg-surface focus:border-text-main transition-all outline-none text-sm"
              placeholder="name@company.com"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted tracking-wide uppercase">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border border-border-strong p-3 rounded-xl bg-input-bg text-text-main placeholder-text-muted focus:bg-surface focus:border-text-main transition-all outline-none text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none mt-2 cursor-pointer"
          >
            {loading &&(
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Logging in..." : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>

          {role === "sales" &&(
            <div className="text-center pt-2">
              <p className="text-sm text-text-muted">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="font-semibold text-text-main hover:underline transition-all"
                >
                  Create one here
                </Link>
              </p>
            </div>
          )}
        </form>

      </div>
    </div>
  )
}

export default LoginForm