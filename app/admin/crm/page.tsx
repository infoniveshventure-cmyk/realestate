'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Lead {
  _id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  propertyType?: string;
  budgetRange?: string;
  message?: string;
  leadStatus: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';
  source?: string;
  nextFollowUp?: string;
  internalNotes?: string;
  createdAt: string;
  lastContactDate?: string;
}

export default function AdminCRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form states for follow-up and notes
  const [followUpDate, setFollowUpDate] = useState('');
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      if (data.success && data.data) {
        setLeads(data.data);
      }
    } catch (e) {
      console.error('Failed to load CRM leads:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(leadId: string, newStatus: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/enquiries/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadStatus: newStatus,
          lastContactDate: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, leadStatus: newStatus as any } : l))
        );
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, leadStatus: newStatus as any } : null));
        }
      }
    } catch (e) {
      console.error('Error updating status:', e);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveFollowUp(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLead) return;
    setSaving(true);
    try {
      const updatePayload: any = {};
      if (followUpDate) updatePayload.nextFollowUp = new Date(followUpDate).toISOString();
      if (noteText) updatePayload.internalNotes = noteText;

      const res = await fetch(`/api/enquiries/${selectedLead._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) =>
            l._id === selectedLead._id
              ? {
                  ...l,
                  nextFollowUp: updatePayload.nextFollowUp || l.nextFollowUp,
                  internalNotes: updatePayload.internalNotes || l.internalNotes,
                }
              : l
          )
        );
        setSelectedLead((prev) =>
          prev
            ? {
                ...prev,
                nextFollowUp: updatePayload.nextFollowUp || prev.nextFollowUp,
                internalNotes: updatePayload.internalNotes || prev.internalNotes,
              }
            : null
        );
        setNoteText('');
        alert('Follow-up schedule and notes recorded.');
      }
    } catch (e) {
      console.error('Failed to save follow-up:', e);
    } finally {
      setSaving(false);
    }
  }

  const filteredLeads = leads.filter((l) => {
    if (statusFilter && l.leadStatus !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        l.fullName.toLowerCase().includes(s) ||
        l.mobileNumber.includes(s) ||
        (l.email && l.email.toLowerCase().includes(s))
      );
    }
    return true;
  });

  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  const followUpsDue = currentTime
    ? leads.filter(
        (l) => l.nextFollowUp && new Date(l.nextFollowUp).getTime() <= currentTime && l.leadStatus !== 'Closed'
      )
    : [];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-ivory sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-accent text-sm hover:underline">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-serif font-bold text-text-dark">
              Lead CRM & Follow-Up Reminders
            </h1>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-ivory text-text-dark hover:bg-accent hover:text-white transition-all"
          >
            Classic View
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-ivory shadow-sm">
            <p className="text-xs text-text-grey uppercase tracking-wider">Total Leads</p>
            <p className="text-3xl font-bold text-text-dark mt-1">{leads.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ivory shadow-sm">
            <p className="text-xs text-orange-600 uppercase tracking-wider">New Enquiries</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">
              {leads.filter((l) => l.leadStatus === 'New').length}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ivory shadow-sm">
            <p className="text-xs text-blue-600 uppercase tracking-wider">Follow-Ups Due</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{followUpsDue.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ivory shadow-sm">
            <p className="text-xs text-green-600 uppercase tracking-wider">Converted</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {leads.filter((l) => l.leadStatus === 'Converted').length}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-ivory shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {['', 'New', 'Contacted', 'Follow-up', 'Converted', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-cream text-text-grey hover:text-text-dark'
                }`}
              >
                {st || 'All Leads'}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-ivory rounded-xl text-xs w-64 focus:outline-none focus:border-accent"
          />
        </div>

        {/* Main CRM Grid: Leads List & Detail / Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leads Table/List */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-ivory overflow-hidden shadow-sm">
            {loading ? (
              <p className="p-8 text-center text-text-grey text-sm">Loading verified leads...</p>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-text-grey text-sm">No matching leads found.</div>
            ) : (
              <div className="divide-y divide-ivory">
                {filteredLeads.map((lead) => {
                  const isDue =
                    currentTime &&
                    lead.nextFollowUp &&
                    new Date(lead.nextFollowUp).getTime() <= currentTime &&
                    lead.leadStatus !== 'Closed';
                  return (
                    <div
                      key={lead._id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setFollowUpDate(
                          lead.nextFollowUp ? new Date(lead.nextFollowUp).toISOString().slice(0, 16) : ''
                        );
                        setNoteText(lead.internalNotes || '');
                      }}
                      className={`p-5 flex items-center justify-between cursor-pointer hover:bg-cream/60 transition-colors ${
                        selectedLead?._id === lead._id ? 'bg-cream/80 border-l-4 border-accent' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="font-semibold text-text-dark text-sm">{lead.fullName}</h2>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              lead.leadStatus === 'New'
                                ? 'bg-orange-100 text-orange-700'
                                : lead.leadStatus === 'Converted'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-accent/15 text-accent'
                            }`}
                          >
                            {lead.leadStatus}
                          </span>
                          {isDue && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                              Follow-Up Due!
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-grey">
                          {lead.mobileNumber} {lead.email ? `• ${lead.email}` : ''}
                        </p>
                        {lead.message && (
                          <p className="text-xs text-text-dark/80 line-clamp-1 mt-1 font-light italic">
                            "{lead.message}"
                          </p>
                        )}
                      </div>

                      <div className="text-right text-xs">
                        <p className="text-text-grey font-mono text-[11px]">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                        {lead.nextFollowUp && (
                          <p className="text-[10px] text-accent mt-1">
                            Next: {new Date(lead.nextFollowUp).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CRM Action & Follow-Up Drawer */}
          <div>
            {selectedLead ? (
              <div className="bg-white rounded-3xl border border-ivory p-6 shadow-sm sticky top-28">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-ivory">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-text-dark">
                      {selectedLead.fullName}
                    </h2>
                    <p className="text-xs text-text-grey">Lead Details & Actions</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/20 text-accent">
                    {selectedLead.leadStatus}
                  </span>
                </div>

                {/* Quick Contact Buttons */}
                <div className="flex gap-2 mb-6">
                  <a
                    href={`tel:${selectedLead.mobileNumber}`}
                    className="flex-1 py-2 text-center rounded-xl bg-ivory text-text-dark hover:bg-accent hover:text-white transition-all text-xs font-semibold"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/${selectedLead.mobileNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedLead.fullName}, thank you for contacting Nivesh Ventures.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-center rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all text-xs font-semibold"
                  >
                    💬 WhatsApp
                  </a>
                  {selectedLead.email && (
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="flex-1 py-2 text-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all text-xs font-semibold"
                    >
                      ✉️ Email
                    </a>
                  )}
                </div>

                {/* Status Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-text-grey mb-1.5 uppercase tracking-wider">
                    Update Lead Status
                  </label>
                  <select
                    value={selectedLead.leadStatus}
                    onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                    disabled={saving}
                    className="w-full px-3 py-2 border border-ivory rounded-xl text-xs bg-cream focus:outline-none focus:border-accent"
                  >
                    {['New', 'Contacted', 'Follow-up', 'Converted', 'Closed'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Follow-up Scheduling Form */}
                <form onSubmit={handleSaveFollowUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-grey mb-1.5 uppercase tracking-wider">
                      Schedule Next Follow-Up Reminder
                    </label>
                    <input
                      type="datetime-local"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 border border-ivory rounded-xl text-xs bg-cream focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-grey mb-1.5 uppercase tracking-wider">
                      Internal CRM Notes
                    </label>
                    <textarea
                      rows={3}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add private conversation notes or requirements..."
                      className="w-full px-3 py-2 border border-ivory rounded-xl text-xs bg-cream focus:outline-none focus:border-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Follow-Up & Notes'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-ivory p-8 text-center text-text-grey text-xs">
                Select a lead from the list to schedule reminders, record notes, or update lead status.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
