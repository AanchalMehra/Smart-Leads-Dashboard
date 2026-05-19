import type { LeadStatus, LeadSource } from "../../types/lead.types"

interface FieldProps {
  isReadOnly: boolean;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  status: LeadStatus;
  setStatus: (v: LeadStatus) => void;
  source: LeadSource;
  setSource: (v: LeadSource) => void;
  notes: string;
  setNotes: (v: string) => void;
}

function LeadFormFields({
  isReadOnly, name, setName, email, setEmail, phone, setPhone,
  status, setStatus, source, setSource, notes, setNotes
}: FieldProps){
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Full Name</label>
        <input className="w-full border border-border-strong bg-input-bg text-text-main p-2.5 rounded-xl text-sm focus:outline-none disabled:opacity-75" value={name} disabled={isReadOnly} onChange={(e)=> setName(e.target.value)} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Email Address</label>
        <input className="w-full border border-border-strong bg-input-bg text-text-main p-2.5 rounded-xl text-sm focus:outline-none disabled:opacity-75" type="email" value={email} disabled={isReadOnly} onChange={(e)=> setEmail(e.target.value)} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Phone Number</label>
        <input className="w-full border border-border-strong bg-input-bg text-text-main p-2.5 rounded-xl text-sm focus:outline-none disabled:opacity-75" value={phone} disabled={isReadOnly} onChange={(e)=> setPhone(e.target.value)} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Lead Status</label>
        <select className="w-full border border-border-strong bg-input-bg text-text-main p-2.5 rounded-xl text-sm focus:outline-none disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed" value={status} disabled={isReadOnly} onChange={(e)=> setStatus(e.target.value as LeadStatus)}>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Lead Source</label>
        <select className="w-full border border-border-strong bg-input-bg text-text-main p-2.5 rounded-xl text-sm focus:outline-none disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed" value={source} disabled={isReadOnly} onChange={(e)=> setSource(e.target.value as LeadSource)}>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Additional Notes</label>
        <textarea className="w-full border border-border-strong bg-input-bg text-text-main p-2.5 rounded-xl text-sm focus:outline-none min-h-[100px] resize-none disabled:opacity-75" value={notes} disabled={isReadOnly} placeholder={isReadOnly ? "No notes available." : "Write detailed notes here..."} onChange={(e)=> setNotes(e.target.value)} />
      </div>
    </div>
  )
}

export default LeadFormFields