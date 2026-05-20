import { Eye, Edit3, Trash2 } from "lucide-react";
import type { Lead } from "../../types/lead.types";
import { useAuth } from "../../context/AuthContext"; 

interface TableProps {
  leads:Lead[];
  onView:(lead:Lead, forceEdit: boolean)=> void;
  onDelete:(lead:Lead)=> void;
}

function LeadsTable({ leads, onView, onDelete }: TableProps) {
  const {user}= useAuth();
  const isAdmin=user?.role==="admin";

  const getStatusStyles=(status:string) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 border-blue-500/20 text-blue-500";
      case "Contacted":
        return "bg-amber-500/10 border-amber-500/20 text-amber-500";
      case "Qualified":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
      case "Lost":
        return "bg-rose-500/10 border-rose-500/20 text-rose-500";
      default:
        return "bg-input-bg border-border-strong text-text-main";
    }
  };

  return (
    /* 
      🔄 ADDED VERTICAL SCROLL: 
      We added 'max-h-full overflow-y-auto' so the container handles up to 10 rows safely.
      'sticky top-0' on the thead elements below keeps the headers visible while you scroll!
    */
    <div className="w-full max-h-full overflow-x-auto overflow-y-auto border border-border-muted bg-surface rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse text-sm text-text-main">
        <thead className="sticky top-0 z-10 bg-surface">
          <tr className="border-b border-border-muted bg-input-bg text-xs font-semibold text-text-muted uppercase tracking-wider">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Status</th>
            <th className="p-4">Source</th>
            {/* Action Column Header */}
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr 
              key={lead._id} 
              className="border-b border-border-muted last:border-none hover:bg-input-bg/40 transition-colors"
            >
              <td className="p-4 font-medium">{lead.name}</td>
              <td className="p-4 text-text-muted">{lead.email}</td>
              <td className="p-4">
                 <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(lead.status)}`}>
                    {lead.status}
                </span>
              </td>
              <td className="p-4 text-text-muted">{lead.source}</td>
              
              {/* Action  */}
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  
                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => onView(lead, false)} // false means Read-Only mode
                    className="p-2 text-text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>

                  {/*  EDIT BUTTON */}
                  <button
                    onClick={() => onView(lead, true)} // true means Edit mode straight away
                    className="p-2 text-text-muted hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Edit Lead"
                  >
                    <Edit3 size={16} />
                  </button>

                  {/* DELETE BUTTON (Admin only) */}
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Delete Lead"
                    >
                       <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadsTable;