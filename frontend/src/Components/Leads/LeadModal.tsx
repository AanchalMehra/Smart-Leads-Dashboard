import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Lead, LeadStatus, LeadSource } from "../../types/lead.types";
import LeadFormFields, { type FormErrors } from "./LeadFormFields";
import LeadModalHeader from "./LeadModalHeader";

interface Props {
  lead: Lead | null;
  initialReadOnly: boolean;
  userRole: string;
  onClose: () => void;
  refresh: () => void;
  onDeleteTrigger: () => void;
}

function LeadModal({ lead, initialReadOnly, userRole, onClose, refresh, onDeleteTrigger }: Props) {
  const isEditMode = Boolean(lead);
  const isAdmin = userRole === "admin";
  const [isReadOnly, setIsReadOnly] = useState<boolean>(initialReadOnly);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [status, setStatus] = useState<LeadStatus>("New");
  const [source, setSource] = useState<LeadSource>("Website");
  const [notes, setNotes] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (lead) {
      setName(lead.name); setEmail(lead.email); setPhone(lead.phone || "");
      setStatus(lead.status); setSource(lead.source); setNotes(lead.notes || "");
      setIsReadOnly(initialReadOnly);
    } else {
      setName(""); setEmail(""); setPhone(""); setStatus("New"); setSource("Website"); setNotes("");
      setIsReadOnly(false);
    }
    setSubmitError(null);
    setErrors({});
  }, [lead, initialReadOnly]); 

  const handleSubmit = async () => {
    const validationErrors: FormErrors = {};

    // Basic required check
    if (!name.trim()) {
      validationErrors.name = "Full name is required.";
    }

    // Basic easy email check: looks for '@' and '.' characters
    if (!email.trim()) {
      validationErrors.email = "Email address is required.";
    } else if (!email.includes("@") || !email.includes(".")) {
      validationErrors.email = "Please enter a valid email address.";
    }

    // Stop if there are errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setSubmitError(null);
      const payload = { name, email, phone, status, source, notes };
      
      if (isEditMode && lead) {
        await api.patch(`/leads/${lead._id}`, payload);
      } else {
        await api.post("/leads", payload);
      }

      refresh(); 
      setIsReadOnly(true); 
      onClose(); 
    } catch (err) {
      console.error("Failed to save lead:", err);
      setSubmitError("Failed to save lead details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-surface border border-border-muted w-full max-w-lg my-auto rounded-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] z-10 text-text-main shadow-2xl overflow-hidden">
        
        <LeadModalHeader 
          isReadOnly={isReadOnly}
          isEditMode={isEditMode}
          isAdmin={isAdmin}
          onEditTrigger={() => setIsReadOnly(false)}
          onDeleteTrigger={onDeleteTrigger}
          onClose={onClose}
        />

        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
          {submitError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl text-sm font-medium">
              {submitError}
            </div>
          )}

          <LeadFormFields
            isReadOnly={isReadOnly} name={name} setName={setName} email={email} setEmail={setEmail}
            phone={phone} setPhone={setPhone} status={status} setStatus={setStatus}
            source={source} setSource={setSource} notes={notes} setNotes={setNotes}
            errors={errors} setErrors={setErrors}
          />
        </div>

        <div className="p-6 border-t border-border-muted flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-border-strong rounded-xl text-sm font-medium text-text-muted hover:text-text-main transition-colors cursor-pointer">
            {isReadOnly ? "Close" : "Cancel"}
          </button>
          {!isReadOnly && (
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-70 disabled:pointer-events-none cursor-pointer">
              {loading ? "Saving..." : isEditMode ? "Update Details" : "Create Lead"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadModal;