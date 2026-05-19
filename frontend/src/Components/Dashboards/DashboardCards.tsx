import type { JSX } from "react"
import { Users, UserPlus, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import type { DashboardStats } from "../../types/dashboard.types"

type Props ={
  stats: DashboardStats
}

function DashboardCards({ stats }:Props): JSX.Element {
  const cardData = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      color: "text-text-main",
      icon: <Users size={20} />
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      color: "text-blue-500",
      icon: <UserPlus size={20} />
    },
    {
      title: "Contacted Leads",
      value: stats.contactedLeads,
      color: "text-amber-500",
      icon: <MessageSquare size={20} />
    },
    {
      title: "Qualified Leads",
      value: stats.qualifiedLeads,
      color: "text-emerald-500",
      icon: <CheckCircle size={20} />
    },
    {
      title: "Lost Leads",
      value: stats.lostLeads,
      color: "text-rose-500",
      icon: <XCircle size={20} />
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {cardData.map((card,index ) => (
        <div
          key={index}
          className="w-full bg-surface border border-border-muted rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between gap-3"
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-text-muted text-xs sm:text-sm font-medium break-words">
              {card.title}
            </p>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight break-all ${card.color}`}>
              { card.value }
            </h2>
          </div>

          <div className="text-text-muted bg-input-bg p-2 sm:p-2.5 rounded-xl flex-shrink-0 flex items-center justify-center">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards