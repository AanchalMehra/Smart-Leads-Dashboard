import type { Lead } from "../../types/lead.types"
import { Eye , Trash2 } from "lucide-react"

interface Props{
  leads : Lead[]
  // Added an optional boolean parameter to toggle view or edit directly
  onView: (lead: Lead, forceEdit?: boolean) => void
  onDelete: (lead: Lead) => void
}

function LeadsTable({ leads, onView, onDelete }: Props) {

  const getStatusClass = (status: string) => {
    switch(status) {
      case "New": return "bg-blue-500/10 border-blue-500/20 text-blue-400"
      case "Contacted": return "bg-amber-500/10 border-amber-500/20 text-amber-500"
      case "Qualified": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
      case "Lost": return "bg-rose-500/10 border-rose-500/20 text-rose-500"
      default: return "bg-input-bg border-border-strong text-text-main"
    }
  }

  return (
    <div className="rounded-2xl border border-border-muted bg-surface shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
        <table className="w-full text-sm text-left border-collapse table-auto">
          
          <thead className="bg-input-bg text-text-muted border-b border-border-strong uppercase tracking-wider text-xs sticky top-0 z-10">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Source</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-muted text-text-main">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-text-muted font-medium">
                  No leads found...
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id}>
                  {/* CLICKING NAME FORCES DIRECT EDIT MODE */}
                  <td
                    className="p-4 cursor-pointer font-semibold hover:underline text-text-main"
                    onClick={() => onView(lead, true)}
                  >
                    {lead.name}
                  </td>
                  
                  <td className="p-4 text-text-muted">{lead.email}</td>
                  
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  
                  <td className="p-4 text-text-muted capitalize">{lead.source}</td>

                  <td className="p-4 text-right">
                    <div className="inline-flex items-center justify-end gap-3 w-full">
                      {/* CLICKING EYE OPENS SAFE VIEW-ONLY MODE */}
                      <button
                        onClick={() => onView(lead, false)}
                        className="p-1.5 text-text-muted hover:text-text-main rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button
                        onClick={() => onDelete(lead)}
                        className="p-1.5 text-text-muted hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default LeadsTable