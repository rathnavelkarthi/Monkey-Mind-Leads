import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { LeadStatus } from '../types';

export const leadStatusEnum = pgEnum('lead_status', Object.values(LeadStatus));

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  company: text('company').notNull(),
  status: leadStatusEnum('status').notNull(),
  notes: text('notes').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});