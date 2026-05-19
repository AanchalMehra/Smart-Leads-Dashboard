import { useCallback, useEffect, useState } from "react"
import api from "../api/axios"

import LeadsTable from "../Components/Leads/LeadsTable"
import Pagination from "../Components/Pagination"
import LeadModal from "../Components/Leads/LeadModel"
import Loading from "../Components/Loading"

import type { Lead, LeadStatus, LeadSource, LeadsResponse } from "../types/lead.types"

function LeadsPage(){
  const [leads,setLeads ]= useState<Lead[]>([])
  const [loading,setLoading]=useState<boolean>(true)
  const [error , setError]= useState<string | null>(null)

  const [search, setSearch]= useState<string>("")
  const [status,setStatus ]= useState<LeadStatus | "">("")
  const [source,setSource]=useState<LeadSource | "">("")
  const [sort, setSort ] =useState<"latest" | "oldest">("latest")

  const [page,setPage] =useState<number>(1)
  const [limit]= useState<number>(10)
  const [totalPages,setTotalPages]=useState<number>(1)

  const [selectedLead,setSelectedLead ]=useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen ] = useState<boolean>(false)
  // Track whether the modal starts locked down or editable on mount
  const [startReadOnly, setStartReadOnly]= useState<boolean>(false)

  const fetchLeads= useCallback(async()=>{
    try{
      setLoading(true)
      setError( null)

      const res= await api.get<LeadsResponse>("/leads",{
        params:{
          page,
          limit,
          search,
          status,
          source,
          sort,
        },
      })

      setLeads(res.data.data)
      setTotalPages(res.data.pagination.pages)
    }catch(err ){
      console.error("Failed to fetch leads")
      setError("Failed to fetch leads. Please try again later.")
    }finally{
      setLoading(false)
    }
  },[page,limit,search,status,source,sort])

  useEffect(()=>{
    const timer= setTimeout(()=>{
      fetchLeads()
    },400)

    return()=> clearTimeout(timer)
  },[fetchLeads])

  useEffect(()=>{
    setPage(1)
  },[search,status,source])

  const handleDelete= async(lead:Lead )=>{
    if(!confirm("Are you sure you want to delete this lead?" )) return

    try{
      await api.delete(`/leads/${lead._id}` )
      fetchLeads()
    }catch(err){
      console.error("Delete failed" )
    }
  }

  return(
    <div className="p-6 bg-canvas min-h-screen text-text-main transition-colors duration-200 flex flex-col gap-4">
      
      {/* FIXED HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <input
            className="border border-border-strong rounded-lg bg-surface px-3 py-2 text-sm text-text-main placeholder-text-muted focus:outline-none w-full sm:w-64"
            placeholder="Search leads..."
            value={search}
            onChange={(e )=> setSearch(e.target.value)}
          />

          <select 
            value={status} 
            onChange={(e)=> setStatus(e.target.value as LeadStatus | "" )}
            className="border border-border-strong rounded-lg bg-surface px-3 py-2 text-sm text-text-main focus:outline-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select 
            value={source} 
            onChange={(e )=> setSource(e.target.value as LeadSource | "")}
            className="border border-border-strong rounded-lg bg-surface px-3 py-2 text-sm text-text-main focus:outline-none cursor-pointer"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <select 
            value={sort} 
            onChange={(e)=> setSort(e.target.value as "latest" | "oldest" )}
            className="border border-border-strong rounded-lg bg-surface px-3 py-2 text-sm text-text-main focus:outline-none cursor-pointer"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <button
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap self-end sm:self-auto"
          onClick={()=>{
            setSelectedLead(null)
            setStartReadOnly(false) // Creating a new lead must be editable right away
            setIsModalOpen(true)
          }}
        >
          Add Lead
        </button>
      </div>

      {/* STABLE WRAPPER CONTAINER */}
      <div className="w-full">
        { loading ? (
          <Loading />
        ) : error ? (
          <div className="border border-rose-500/20 bg-rose-500/10 text-rose-500 rounded-lg p-4 text-sm font-medium">
            { error }
          </div>
        ) : leads.length === 0 ? (
          <div className="border border-border-strong bg-surface rounded-xl p-12 text-center text-text-muted text-sm font-medium">
            No leads available in this view.
          </div>
        ) : (
          <LeadsTable
            leads={leads}
            onView={(lead, forceEdit)=>{
              setSelectedLead(lead)
              setStartReadOnly(!forceEdit) // View mode opens read-only, quick-links open editable
              setIsModalOpen(true)
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* PAGINATION PANEL - SECURED UNDER THE DATA WINDOW BOX */}
      { !error && leads.length > 0 && (
        <div className="pt-2">
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
      )}

      {isModalOpen &&(
        <LeadModal
          lead={selectedLead}
          initialReadOnly={startReadOnly}
          onClose={()=> setIsModalOpen(false )}
          refresh={fetchLeads}
        />
      )}
    </div>
  )
}

export default LeadsPage