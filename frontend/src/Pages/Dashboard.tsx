import { useEffect, useState } from "react"
import type { JSX } from "react"
import api from "../api/axios"
import Loading from "../Components/Loading"
import DashboardCards from "../Components/Dashboards/DashboardCards"
import { AxiosError } from "axios"
import type { DashboardData } from "../types/dashboard.types"
import { useAuth } from "../context/AuthContext"

function Dashboard(): JSX.Element {
  const [data,setData]= useState<DashboardData | null>(null)
  const [loading,setLoading]= useState<boolean>(true)
  const [error, setError]= useState<string>("")

  const { user}= useAuth()

  useEffect(() => {
    const fetchDashboard = async (): Promise<void> => {
      try {
        const res = await api.get<DashboardData>("/dashboard")
        setData(res.data)
      } 
      catch (err: unknown) {
        let message: string = "Failed to load dashboard"

        if (err instanceof AxiosError) {
          message = err.response?.data?.message || err.message || message
        } 
        else if (err instanceof Error) {
          message = err.message
        }
        setError(message)
      } 
      finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading){
    return <Loading fullScreen/>
  }

  if (error){
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas text-rose-500">
        <p>{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas text-text-muted">
        <p>No dashboard data found...</p>
      </div>
    )
  }

  const firstName= user?.name?user.name.split(" ")[0] : ""

  const title:string= firstName?`Welcome back, ${firstName}!` : `Welcome back, ${data.role}!`
  const subtitle:string= data.role==="admin"
    ? "Overview of administrative metrics"
    : "Your sales metrics and performance"
  
  return (
    <div className="p-6 bg-canvas min-h-screen text-text-main transition-colors duration-200 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">{title}</h1>
        <p className="text-text-muted text-sm mt-1">{subtitle}</p>
      </div>

      <DashboardCards
        stats={{
          totalLeads:data?.stats?.totalLeads?? 0,
          newLeads: data?.stats?.newLeads?? 0,
          contactedLeads: data?.stats?.contactedLeads?? 0,
          qualifiedLeads: data?.stats?.qualifiedLeads?? 0,
          lostLeads: data?.stats?.lostLeads??0,
        }}
      />
    </div>
  )
}

export default Dashboard