import React, { useState, useEffect, useMemo } from 'react';
import { Lead, LeadStatus } from './types';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { UserIcon } from './components/icons/UserIcon';
import { PlusIcon } from './components/icons/PlusIcon';
import { ArrowLeftIcon } from './components/icons/ArrowLeftIcon';
import { TrashIcon } from './components/icons/TrashIcon';
import { STATUS_COLORS } from './constants';
import { WhatsAppIcon } from './components/icons/WhatsAppIcon';
import { SaveIcon } from './components/icons/SaveIcon';
import { CheckIcon } from './components/icons/CheckIcon';

const initialLeads: Lead[] = [
  { id: '1', name: 'John Doe', phone: '+1-555-123-4567', company: 'Innovate Corp', status: LeadStatus.New, notes: 'Met at the tech conference. Interested in our AI solutions. Follow up about pricing.', updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '2', name: 'Jane Smith', phone: '+1-555-987-6543', company: 'Solutions Inc.', status: LeadStatus.Contacted, notes: 'Had a brief call. Sent them our brochure. Needs to discuss with her team.', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '3', name: 'Peter Jones', phone: '+1-555-555-5555', company: 'Future Enterprises', status: LeadStatus.Qualified, notes: 'Demo scheduled for next week. Very promising lead.', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '4', name: 'Mary Garcia', phone: '+1-555-111-2222', company: 'Data Dynamics', status: LeadStatus.Lost, notes: 'Chose a competitor due to budget constraints.', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: '5', name: 'Carlos Hernandez', phone: '+1-555-333-4444', company: 'Synergy Systems', status: LeadStatus.Won, notes: 'Signed the contract today! Great win for the team.', updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
];

type View = 'list' | 'detail' | 'add';
type SaveState = 'idle' | 'saving' | 'saved';


// --- Standalone Components ---
interface LeadListProps {
    sortedLeads: Lead[];
    selectedLead: Lead | null;
    onSelectLead: (lead: Lead) => void;
    onShowAddForm: () => void;
    formatDateTime: (isoString: string) => string;
    onSaveChanges: () => void;
    hasUnsavedChanges: boolean;
    saveState: SaveState;
}

const LeadList: React.FC<LeadListProps> = ({ sortedLeads, selectedLead, onSelectLead, onShowAddForm, formatDateTime, onSaveChanges, hasUnsavedChanges, saveState }) => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
        <div className="p-4 border-b flex items-center space-x-2">
            <button
                onClick={onShowAddForm}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 font-medium shadow-sm"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New Lead
            </button>
            <button
                onClick={onSaveChanges}
                disabled={!hasUnsavedChanges || saveState === 'saving'}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${!hasUnsavedChanges && saveState !== 'saved' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}
                    ${hasUnsavedChanges && saveState === 'idle' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' : ''}
                    ${saveState === 'saving' ? 'bg-blue-400 text-white cursor-wait' : ''}
                    ${saveState === 'saved' || (!hasUnsavedChanges && saveState === 'idle') ? 'bg-green-500 text-white focus:ring-green-500' : ''}
                `}
            >
                {saveState === 'saving' ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : saveState === 'saved' || !hasUnsavedChanges ? (
                    <CheckIcon className="w-5 h-5 mr-2" />
                ) : (
                    <SaveIcon className="w-5 h-5 mr-2" />
                )}
                
                {saveState === 'saving' ? 'Saving...' : saveState === 'saved' || !hasUnsavedChanges ? 'All Saved' : 'Save Changes'}
            </button>
        </div>
        <div className="flex-1 overflow-y-auto">
            {sortedLeads.map(lead => (
                <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className={`p-4 cursor-pointer border-l-4 ${selectedLead?.id === lead.id ? 'border-purple-600 bg-purple-50' : 'border-transparent hover:bg-gray-50'}`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                            <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                            <p className="text-sm text-gray-500 truncate">{lead.company}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Updated: {formatDateTime(lead.updatedAt)}
                            </p>
                        </div>
                        <span className={`flex-shrink-0 px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[lead.status]}`}>
                            {lead.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

interface LeadDetailProps {
    lead: Lead;
    isMobile: boolean;
    onBack: () => void;
    onChange: (updatedLead: Lead) => void;
    onDelete: (leadId: string) => void;
    onOpenWhatsApp: (lead: Lead) => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, isMobile, onBack, onChange, onDelete, onOpenWhatsApp }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({ ...lead, [name]: value });
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center mb-6">
                {isMobile && (
                     <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-200">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                    </button>
                )}
                <div className="bg-gray-200 p-3 rounded-full mr-4">
                    <UserIcon className="w-8 h-8 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{lead.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <input type="text" name="name" value={lead.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600">Company</label>
                    <input type="text" name="company" value={lead.company} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <input type="text" name="phone" value={lead.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600">Notes</label>
                    <textarea name="notes" value={lead.notes} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <select name="status" value={lead.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="pt-4 flex flex-wrap gap-4 items-center justify-between">
                    <button
                        type="button"
                        onClick={() => onOpenWhatsApp(lead)}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium shadow-sm transition-transform transform hover:scale-105"
                    >
                        <WhatsAppIcon className="w-5 h-5 mr-2" />
                        WhatsApp
                    </button>
                    <button 
                        type="button" 
                        onClick={() => onDelete(lead.id)} 
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium shadow-sm transition-transform transform hover:scale-105">
                        <TrashIcon className="w-5 h-5 mr-2" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

interface AddLeadFormProps {
    isMobile: boolean;
    onBack: () => void;
    onAdd: (newLeadData: Omit<Lead, 'id' | 'updatedAt'>) => void;
}

const AddLeadForm: React.FC<AddLeadFormProps> = ({ isMobile, onBack, onAdd }) => {
    const [formData, setFormData] = useState({ name: '', company: '', phone: '', notes: '', status: LeadStatus.New });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as LeadStatus }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.company) {
            alert("Name and Company are required.");
            return;
        }
        onAdd(formData as Omit<Lead, 'id' | 'updatedAt'>);
    };
    
    return (
         <div className="p-6 h-full">
            <div className="flex items-center mb-6">
                {isMobile && (
                     <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-200">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                    </button>
                )}
                <h2 className="text-2xl font-bold text-gray-800">Add New Lead</h2>
            </div>
             <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="pt-4">
                    <button type="submit" className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Add Lead</button>
                </div>
            </form>
        </div>
    );
};

const WelcomeMessage = () => (
    <div className="h-full flex flex-col justify-center items-center text-center text-gray-500 p-6">
        <UserIcon className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-xl font-medium">Select a lead to see details</h3>
        <p className="mt-1">or add a new lead to get started.</p>
    </div>
);

const App = () => {
    const [persistedLeads, setPersistedLeads] = useState<Lead[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
    const [currentView, setCurrentView] = useState<'list' | 'detail' | 'add'>('list');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [leadForWhatsApp, setLeadForWhatsApp] = useState<Lead | null>(null);
    
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saveState, setSaveState] = useState<SaveState>('idle');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/.netlify/functions/leads');
                if (!response.ok) {
                    throw new Error(`Failed to fetch leads: ${response.statusText}`);
                }
                const loadedLeads: Lead[] = await response.json();
                setLeads(loadedLeads);
                setPersistedLeads(loadedLeads);
            } catch (error) {
                console.error("Failed to load leads from database:", error);
                // Fallback to initial data if DB fails, for demo purposes
                setLeads(initialLeads);
                setPersistedLeads(initialLeads);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeads();
    }, []);

    useEffect(() => {
        const hasChanges = JSON.stringify(leads) !== JSON.stringify(persistedLeads);
        setHasUnsavedChanges(hasChanges);
        if (hasChanges) {
          setSaveState('idle');
        }
    }, [leads, persistedLeads]);
    
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);
    
    const sortedLeads = useMemo(() => {
        return [...leads].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [leads]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const handleSelectLead = (lead: Lead) => {
        setSelectedLead(lead);
        if (isMobile) setCurrentView('detail');
    };

    const handleShowAddForm = () => {
        setSelectedLead(null);
        if (isMobile) setCurrentView('add');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedLead(null);
    };
    
    const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'updatedAt'>) => {
        const newLead: Lead = {
            ...newLeadData,
            id: crypto.randomUUID(),
            updatedAt: new Date().toISOString(),
        };
        setLeads(prevLeads => [...prevLeads, newLead]);
        setSelectedLead(newLead);
        if (isMobile) {
            setCurrentView('detail');
        }
    };
    
    const handleLeadChange = (updatedLead: Lead) => {
        const updatedLeads = leads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead));
        setLeads(updatedLeads);
        setSelectedLead(updatedLead);
    };

    const handleDeleteLead = (leadId: string) => {
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
            setLeadToDelete(lead);
            setIsDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (!leadToDelete) return;
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadToDelete.id));
        handleBackToList();
        setIsDeleteModalOpen(false);
        setLeadToDelete(null);
    };

    const handleSaveChanges = async () => {
        if (!hasUnsavedChanges) return;
        
        setSaveState('saving');
        
        try {
            const now = new Date().toISOString();
            const persistedLeadsMap = new Map(persistedLeads.map(l => [l.id, JSON.stringify(l)]));
            
            const leadsToSave = leads.map(currentLead => {
                const originalLead = persistedLeads.find(p => p.id === currentLead.id);
                const isNew = !originalLead;
                const isModified = originalLead && JSON.stringify(currentLead) !== JSON.stringify(originalLead);

                if (isNew || isModified) {
                    return { ...currentLead, updatedAt: now };
                }
                return currentLead;
            });
            
            const response = await fetch('/.netlify/functions/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadsToSave),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save changes: ${errorText}`);
            }

            setLeads(leadsToSave);
            setPersistedLeads(leadsToSave);
            
            setSaveState('saved');
            setTimeout(() => {
                setSaveState(current => (current === 'saved' ? 'idle' : current));
            }, 2000);

        } catch (error) {
            console.error("Failed to save leads:", error);
            setSaveState('idle');
            alert('Failed to save changes. Please try again.');
        }
    };
    
    const handleOpenWhatsAppModal = (lead: Lead) => {
        setLeadForWhatsApp(lead);
        setIsWhatsAppModalOpen(true);
    };

    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };
    
    const renderMainContent = () => {
        const showAddForm = !selectedLead && (!isMobile || currentView === 'add');
        if (showAddForm) {
            return <AddLeadForm isMobile={isMobile} onBack={handleBackToList} onAdd={handleAddLead} />;
        }
        if (selectedLead && (!isMobile || currentView === 'detail')) {
            return <LeadDetail 
                lead={selectedLead}
                isMobile={isMobile}
                onBack={handleBackToList}
                onChange={handleLeadChange}
                onDelete={handleDeleteLead}
                onOpenWhatsApp={handleOpenWhatsAppModal}
            />;
        }
        if (!isMobile) {
            return <WelcomeMessage />;
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg text-gray-600">Loading Leads from Database...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-gray-100 font-sans flex flex-col">
            <header className="bg-white shadow-sm flex-shrink-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Monkey Mind Leads</h1>
                </div>
            </header>
            <div className="flex-1 flex overflow-hidden">
                {(!isMobile || currentView === 'list') && (
                    <aside className="w-full md:w-1/3 lg:w-1/4 h-full">
                       <LeadList 
                         sortedLeads={sortedLeads}
                         selectedLead={selectedLead}
                         onSelectLead={handleSelectLead}
                         onShowAddForm={handleShowAddForm}
                         formatDateTime={formatDateTime}
                         onSaveChanges={handleSaveChanges}
                         hasUnsavedChanges={hasUnsavedChanges}
                         saveState={saveState}
                       />
                    </aside>
                )}
                {(!isMobile || currentView !== 'list') && (
                    <main className="flex-1 h-full bg-white">
                        {renderMainContent()}
                    </main>
                )}
            </div>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setLeadToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Lead"
                message={leadToDelete ? `Are you sure you want to permanently delete "${leadToDelete.name}"? This action cannot be undone.` : ''}
            />
            <WhatsAppModal 
                isOpen={isWhatsAppModalOpen}
                onClose={() => setIsWhatsAppModalOpen(false)}
                lead={leadForWhatsApp}
            />
        </div>
    );
}

export default App;