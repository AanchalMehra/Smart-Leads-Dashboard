import { useEffect, useState } from "react"
import api from "../../api/axios"
import type { Lead, LeadStatus, LeadSource } from "../../types/lead.types"
import { Edit3, X } from "lucide-react"
import LeadFormFields from "./LeadFormFields"

interface Props {
  lead: Lead | null;
  initialReadOnly: boolean;
  onClose: () => void;
  refresh: () => void;
}

function LeadModal({ lead, initialReadOnly, onClose, refresh }: Props){
  const isEditMode = Boolean(lead);
  
  const [isReadOnly, setIsReadOnly] = useState<boolean>(initialReadOnly)

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [status, setStatus] = useState<LeadStatus>("New")
  const [source, setSource] = useState<LeadSource>("Website")
  const [notes, setNotes] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (lead) {
      setName(lead.name); setEmail(lead.email); setPhone(lead.phone || "");
      setStatus(lead.status); setSource(lead.source); setNotes(lead.notes || "");
      setIsReadOnly(initialReadOnly)
    } else {
      setName(""); setEmail(""); setPhone(""); setStatus("New"); setSource("Website"); setNotes("");
      setIsReadOnly(false)
    }
    setSubmitError(null)
  }, [lead, initialReadOnly]);

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setSubmitError(null)

      const payload = { name, email, phone, status, source, notes };
      
      if (isEditMode && lead) {
        // Double-check your backend schema expects '_id' parameter identifier
        await api.patch(`/leads/${lead._id}`, payload);
      } else {
        await api.post("/leads", payload);
      }

      // SUCCESS SEQUENCE PIPELINE FLUSH
      refresh(); 
      setIsReadOnly(true); 
      onClose(); 
    } catch (err) {
      console.error("Failed to save lead:", err)
      setSubmitError("Failed to update lead details. Please check your inputs or try again.")
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal window container box */}
      <div className="relative bg-surface border border-border-muted w-full max-w-lg my-auto rounded-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] z-10 text-text-main shadow-xl">
        
        <div className="p-6 border-b border-border-muted flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold tracking-tight text-text-main">
            {isReadOnly ? "Lead Details" : isEditMode ? "Modify Lead Details" : "Register New Lead"}
          </h2>
          <div className="flex items-center gap-1.5">
            {isReadOnly && isEditMode && (
              <button 
                onClick={() => setIsReadOnly(false)} 
                className="p-2 text-text-muted hover:text-blue-500 hover:bg-input-bg rounded-xl transition-colors cursor-pointer"
                title="Edit Lead Parameters"
              >
                <Edit3 size={18} />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main hover:bg-input-bg rounded-xl transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* INJECTED FORM INPUT CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
          {submitError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl text-sm font-medium">
              {submitError}
            </div>
          )}

          <LeadFormFields
            isReadOnly={isReadOnly} 
            name={name} setName={setName} 
            email={email} setEmail={setEmail}
            phone={phone} setPhone={setPhone} 
            status={status} setStatus={setStatus}
            source={source} setSource={setSource} 
            notes={notes} setNotes={setNotes}
          />
        </div>

        <div className="p-6 border-t border-border-muted flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-border-strong rounded-xl text-sm font-medium text-text-muted hover:text-text-main transition-colors cursor-pointer"
          >
            {isReadOnly ? "Close" : "Cancel"}
          </button>
          {!isReadOnly && (
            <button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? "Saving..." : isEditMode ? "Update Details" : "Create Lead"}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default LeadModal