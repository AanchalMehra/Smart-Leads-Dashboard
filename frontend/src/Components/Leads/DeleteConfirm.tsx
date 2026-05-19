import { AlertTriangle } from "lucide-react"

interface DeleteConfirmProps {
  name: string;
  deleteLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirm({ name, deleteLoading, onCancel, onConfirm }: DeleteConfirmProps) {
  return (
<div className="absolute inset-0 z-50 bg-surface/95 backdrop-blur-xs flex items-center justify-center p-6 transition-all duration-200">      <div className="text-center max-w-sm flex flex-col items-center gap-4">
        <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-500 border border-rose-500/20">
          <AlertTriangle size={32} />
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-text-main">Delete this lead record?</h3>
          <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
            Are you sure you want to permanently delete <span className="font-semibold text-text-main">"{name}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full mt-2">
          <button
            onClick={onCancel}
            disabled={deleteLoading}
            className="flex-1 py-2.5 border border-border-strong rounded-xl text-sm font-medium text-text-muted hover:text-text-main transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleteLoading}
            className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition cursor-pointer font-semibold shadow-sm shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center"
          >
            {deleteLoading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirm