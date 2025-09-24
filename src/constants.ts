// FIX: Replaced placeholder content with actual constants.
import { LeadStatus } from './types';

export const STATUS_COLORS: { [key in LeadStatus]: string } = {
  [LeadStatus.New]: 'bg-blue-200 text-blue-800',
  [LeadStatus.Contacted]: 'bg-yellow-200 text-yellow-800',
  [LeadStatus.Qualified]: 'bg-green-200 text-green-800',
  [LeadStatus.Lost]: 'bg-red-200 text-red-800',
  [LeadStatus.Won]: 'bg-purple-200 text-purple-800',
};
