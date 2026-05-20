import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

import LeadsTable from "../Components/Leads/LeadsTable";
import Pagination from "../Components/Pagination";
import LeadModal from "../Components/Leads/LeadModal";
import DeleteConfirm from "../Components/Leads/DeleteConfirm";
import Loading from "../Components/Loading";
import ExportCSV from "../Components/ExportCsv";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

import type { Lead, LeadStatus, LeadSource, LeadsResponse } from "../types/lead.types";
import { useAuth } from "../context/AuthContext"; 

function LeadsPage(){
  // Extract real user details from context
  const { user } = useAuth();
  const userRole = user?.role || "sales";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [error , setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [startReadOnly, setStartReadOnly] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Mobile Filter Menu
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  const activeFilterCount = [status, source].filter(Boolean).length;

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get<LeadsResponse>("/leads", {
        params: { page, limit, search, status, source, sort },
      });

      setLeads(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError("Failed to fetch leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, source, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [search, status, source]);

  // Handle opening the detached delete confirmation popup
  const openDeletePopup = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDeleteConfirm(true);
  };

  // Safe database delete routine
  const handleConfirmedDelete = async () => {
    if (!selectedLead) return;

    try {
      setDeleteLoading(true);
      await api.delete(`/leads/${selectedLead._id}`);
      
      setShowDeleteConfirm(false);
      setIsModalOpen(false); // Closes the underlying detail sheet at the same time
      setSelectedLead(null);
      
      fetchLeads();
    } catch (err) {
      console.error("Delete call failed:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-canvas h-[calc(100vh-4rem)] text-text-main transition-colors duration-200 flex flex-col gap-4 overflow-hidden">
      
      {/* HEADER CONTROL ACTIONS BAR */}
      <div className="flex flex-col gap-3 shrink-0 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search Field */}
        <div className="flex items-center gap-2 flex-1 w-full sm:max-w-xs">
          <input
            className="border border-border-strong rounded-xl bg-surface px-3 py-2 text-sm text-text-main placeholder-text-muted focus:outline-none w-full"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          {/* MOBILE ONLY Filters Toggle */}
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className={`sm:hidden flex items-center gap-1.5 border px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              isFilterMenuOpen || activeFilterCount > 0 
                ? "border-blue-500/30 bg-blue-500/10 text-blue-400" 
                : "border-border-strong bg-surface text-text-muted"
            }`}
          >
            <Filter size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                {activeFilterCount}
              </span>
            )}
            {isFilterMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* TOP BUTTON ACTIONS ROW */}
        <div className="flex items-center gap-2 shrink-0 justify-end sm:w-auto">
          <ExportCSV disabled={loading} />

          <button
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition active:scale-[0.98] cursor-pointer whitespace-nowrap flex-1 sm:flex-none justify-center text-center"
            onClick={() => {
              setSelectedLead(null);
              setStartReadOnly(false);
              setIsModalOpen(true);
            }}
          >
            Add Lead
          </button>
        </div>
      </div>

      {/* FILTERS CONTAINER */}
      <div className={`shrink-0 transition-all duration-200 ${
        isFilterMenuOpen ? "block" : "hidden sm:block"
      }`}>
        <div className="bg-surface sm:bg-transparent border border-border-muted sm:border-none p-4 sm:p-0 rounded-xl grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block sm:hidden">Status</span>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as LeadStatus | "" )}
              className="border border-border-strong rounded-xl bg-surface px-3 py-2 text-sm text-text-main focus:outline-none cursor-pointer w-full"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block sm:hidden">Source</span>
            <select 
              value={source} 
              onChange={(e) => setSource(e.target.value as LeadSource | "")}
              className="border border-border-strong rounded-xl bg-surface px-3 py-2 text-sm text-text-main focus:outline-none cursor-pointer w-full"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full col-span-2 sm:w-auto">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block sm:hidden">Sort Sequence</span>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value as "latest" | "oldest" )}
              className="border border-border-strong rounded-xl bg-surface px-3 py-2 text-sm text-text-main focus:outline-none cursor-pointer w-full"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* CENTRAL DATA LIST SPACE */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="border border-rose-500/20 bg-rose-500/10 text-rose-500 rounded-xl p-4 text-sm font-medium">
            {error}
          </div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-text-muted border border-dashed border-border-strong rounded-2xl bg-surface">
            No leads found matching your search options.
          </div>
        ) : (
          <LeadsTable
            leads={leads}
            onView={(lead, forceEdit) => {
              setSelectedLead(lead);
              setStartReadOnly(!forceEdit);
              setIsModalOpen(true);
            }}
            onDelete={openDeletePopup}
          />
        )}
      </div>

      {/* PAGINATION PANEL FOOTER - Mobile Layout Optimized */}
      {!error && leads.length > 0 && (
        <div className="shrink-0 pt-3 pb-2 sm:pb-0 border-t border-border-muted bg-canvas w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-text-muted text-center sm:text-left order-2 sm:order-1">
            Page <span className="font-semibold text-text-main">{page}</span> of <span className="font-semibold text-text-main">{totalPages}</span>
          </div>
          <div className="w-full sm:w-auto order-1 sm:order-2 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </div>
      )}

      {/* Main View/Edit Slide Panel */}
      {isModalOpen && (
        <LeadModal
          lead={selectedLead}
          initialReadOnly={startReadOnly}
          userRole={userRole}
          onClose={() => { setIsModalOpen(false); setSelectedLead(null); }}
          refresh={fetchLeads}
          onDeleteTrigger={() => setShowDeleteConfirm(true)}
        />
      )}

      {/* Isolated Global Confirmation Popup Overlay */}
      {showDeleteConfirm && selectedLead && (
        <DeleteConfirm
          name={selectedLead.name}
          deleteLoading={deleteLoading}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmedDelete}
        />
      )}
    </div>
  );
}

export default LeadsPage;