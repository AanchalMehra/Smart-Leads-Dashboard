import { Edit3, X, Trash2 } from "lucide-react"

interface LeadModalHeaderProps {
  isReadOnly: boolean;
  isEditMode: boolean;
  onEditTrigger: () => void;
  onDeleteTrigger: () => void;
  onClose: () => void;
}

function LeadModalHeader({ isReadOnly, isEditMode, onEditTrigger, onDeleteTrigger, onClose }: LeadModalHeaderProps) {
  return (
    <div className="p-6 border-b border-border-muted flex items-center justify-between shrink-0">
      <h2 className="text-xl font-bold tracking-tight text-text-main">
        {isReadOnly ? "Lead Details" : isEditMode ? "Modify Lead Details" : "Register New Lead"}
      </h2>
      <div className="flex items-center gap-1.5">
        {isReadOnly && isEditMode && (
          <>
            <button 
              onClick={onDeleteTrigger} 
              className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              title="Delete Lead"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={onEditTrigger} 
              className="p-2 text-text-muted hover:text-blue-500 hover:bg-input-bg rounded-xl transition-colors cursor-pointer"
              title="Edit Lead Parameters"
            >
              <Edit3 size={18} />
            </button>
          </>
        )}
        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main hover:bg-input-bg rounded-xl transition-colors cursor-pointer">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default LeadModalHeader