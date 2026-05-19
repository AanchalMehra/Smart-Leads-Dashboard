export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

export type LeadSource = "Website" | "Instagram" | "Referral";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsResponse {
  data: Lead[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
}