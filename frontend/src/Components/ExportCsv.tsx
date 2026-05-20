import { useState } from "react"
import api from "../api/axios";
import toast from "react-hot-toast"

interface Props {
  disabled?: boolean;
}

function ExportCSV({ disabled }: Props) {
  const [exporting, setExporting] = useState<boolean>(false)

  const handleExportCSV = async () => {
    try {
      setExporting(true)
      
      // Grab all leads at once bypassing current page limits
      const res= await api.get("/leads", { params: { limit: 1000 } })
      const rawLeads=res.data?.data || []

      if (rawLeads.length===0) {
        toast.error("No lead records available to export.")
        return
      }

      const headers=["ID", "Name", "Email", "Phone", "Status", "Source", "Notes"]
      const csvRows=[
        headers.join(","),
        ...rawLeads.map((lead: any) => [
          `"${lead._id || ''}"`,
          `"${(lead.name || '').replace(/"/g, '""')}"`,
          `"${(lead.email || '').replace(/"/g, '""')}"`,
          `"${(lead.phone || '').replace(/"/g, '""')}"`,
          `"${lead.status || ''}"`,
          `"${lead.source || ''}"`,
          `"${(lead.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ].join(","))
      ]

      const blob= new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
      const url= URL.createObjectURL(blob)
      const link= document.createElement("a")
      link.href= url
      link.setAttribute("download", `SmartLeads_Export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("CSV file downloaded successfully!")
    } 
    catch(err) {
      console.error("CSV Export failure:", err)
      toast.error("Failed to compile CSV document.")
    } 
    finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExportCSV}
      disabled={exporting || disabled}
      className="border border-border-strong bg-surface hover:bg-input-bg text-text-main font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
    >
      {exporting ? "Exporting..." : "Export CSV"}
    </button>
  )
}

export default ExportCSV