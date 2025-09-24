// FIX: Removed self-import of `LeadStatus` which was causing a circular dependency and declaration conflict.
export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Lost = 'Lost',
  Won = 'Won',
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  company: string;
  status: LeadStatus;
  notes: string;
  updatedAt: string; // ISO string
}