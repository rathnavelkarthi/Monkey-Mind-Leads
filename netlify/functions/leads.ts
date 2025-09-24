import type { Handler } from "@netlify/functions";
import { db } from '../../src/db/client';
import { leads } from '../../src/db/schema';
import { notInArray } from 'drizzle-orm';
import { Lead } from "../../src/types";

export const handler: Handler = async (event) => {
    try {
        if (event.httpMethod === 'GET') {
            const allLeads = await db.query.leads.findMany({
                orderBy: (leads, { desc }) => [desc(leads.updatedAt)],
            });
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(allLeads.map(lead => ({...lead, updatedAt: lead.updatedAt.toISOString()}))),
            };
        }

        if (event.httpMethod === 'POST') {
            if (!event.body) {
                return { statusCode: 400, body: 'Missing request body' };
            }
            const incomingLeads = JSON.parse(event.body) as Lead[];
            
            await db.transaction(async (tx) => {
                const incomingLeadIds = incomingLeads.map(l => l.id);

                if (incomingLeadIds.length > 0) {
                    await tx.delete(leads).where(notInArray(leads.id, incomingLeadIds));
                } else {
                    await tx.delete(leads);
                }

                if (incomingLeads.length > 0) {
                    for (const lead of incomingLeads) {
                        await tx.insert(leads).values({
                            ...lead,
                            updatedAt: new Date(lead.updatedAt)
                        }).onConflictDoUpdate({
                            target: leads.id,
                            set: {
                                name: lead.name,
                                phone: lead.phone,
                                company: lead.company,
                                status: lead.status,
                                notes: lead.notes,
                                updatedAt: new Date(lead.updatedAt),
                            }
                        });
                    }
                }
            });

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Leads saved successfully' }),
            };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };

    } catch (error) {
        console.error("Database operation failed:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { statusCode: 500, body: `Server error: ${errorMessage}` };
    }
};
