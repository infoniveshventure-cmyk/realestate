'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  async function fetchEnquiries() {
    try {
      setLoading(true);
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      let filtered = data.data || [];
      if (statusFilter) {
        filtered = filtered.filter((e: any) => e.leadStatus === statusFilter);
      }
      setEnquiries(filtered);
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadStatus: newStatus, lastContactDate: new Date() }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, leadStatus: newStatus, lastContactDate: new Date() } : e))
        );
      }
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setUpdatingId(null);
    }
  }

  function exportToCSV() {
    if (enquiries.length === 0) return;
    const headers = ['Full Name', 'Mobile Number', 'Email', 'Property Type', 'Budget', 'Status', 'Date Received', 'Message'];
    const rows = enquiries.map((e) => [
      `"${e.fullName || ''}"`,
      `"${e.mobileNumber || ''}"`,
      `"${e.email || ''}"`,
      `"${e.propertyType || e.projectName || ''}"`,
      `"${e.budgetRange || ''}"`,
      `"${e.leadStatus || 'New'}"`,
      `"${new Date(e.createdAt).toLocaleDateString()}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nivesh_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const statuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Closed'];
  const displayEnquiries = search
    ? enquiries.filter(
        (e) =>
          e.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          e.mobileNumber?.includes(search) ||
          e.email?.toLowerCase().includes(search.toLowerCase())
      )
    : enquiries;

  const selectedEnquiry = enquiries.find((e) => e._id === selectedId);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-ivory sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="text-accent hover:underline text-xs font-bold uppercase mb-1 block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">Enquiries & Inbound Leads</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 rounded-lg bg-white border border-ivory text-xs font-bold uppercase tracking-wider text-text-dark hover:border-accent shadow-sm"
            >
              📥 Export CSV
            </button>
            <Link
              href="/admin/crm"
              className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 shadow-sm"
            >
              Open CRM View →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Filter & Search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === ''
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-white border border-ivory text-text-grey hover:border-accent'
              }`}
            >
              All ({enquiries.length})
            </button>
            {statuses.map((status) => {
              const count = enquiries.filter((e) => e.leadStatus === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    statusFilter === status
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-white border border-ivory text-text-grey hover:border-accent'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>

          <div>
            <input
              type="text"
              placeholder="Search leads by name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 px-4 py-2 bg-white border border-ivory rounded-lg text-xs focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Layout: Table + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enquiries Table */}
          <div className="lg:col-span-2">
            {loading ? (
              <p className="text-text-grey py-8 text-center">Loading enquiries...</p>
            ) : displayEnquiries.length === 0 ? (
              <p className="text-text-grey py-8 text-center bg-white rounded-lg border border-ivory">
                No enquiries match criteria.
              </p>
            ) : (
              <div className="bg-white rounded-lg border border-ivory overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-cream border-b border-ivory font-bold uppercase text-text-grey text-[10px]">
                      <th className="px-4 py-3.5">Name</th>
                      <th className="px-4 py-3.5">Mobile</th>
                      <th className="px-4 py-3.5">Property</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory">
                    {displayEnquiries.map((enquiry: any) => (
                      <tr
                        key={enquiry._id}
                        onClick={() => setSelectedId(enquiry._id)}
                        className={`hover:bg-cream/60 cursor-pointer transition-colors ${
                          selectedId === enquiry._id ? 'bg-cream/80 font-semibold' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5 font-bold text-text-dark">{enquiry.fullName}</td>
                        <td className="px-4 py-3.5 text-text-grey">{enquiry.mobileNumber}</td>
                        <td className="px-4 py-3.5 text-text-grey">{enquiry.propertyType || enquiry.projectName || 'General'}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              enquiry.leadStatus === 'New'
                                ? 'bg-orange-100 text-orange-700'
                                : enquiry.leadStatus === 'Converted'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-accent/20 text-accent'
                            }`}
                          >
                            {enquiry.leadStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-text-grey">
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div>
            {selectedEnquiry ? (
              <div className="bg-white rounded-lg border border-ivory p-6 shadow-sm sticky top-28">
                <h2 className="text-lg font-serif font-bold text-text-dark mb-4">Enquiry Dossier</h2>

                <div className="space-y-3.5 mb-6 text-xs">
                  <div>
                    <p className="text-[#888888] font-bold uppercase text-[10px]">Name</p>
                    <p className="font-bold text-sm text-text-dark">{selectedEnquiry.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[#888888] font-bold uppercase text-[10px]">Mobile</p>
                    <a
                      href={`tel:${selectedEnquiry.mobileNumber}`}
                      className="font-semibold text-accent hover:underline text-sm"
                    >
                      {selectedEnquiry.mobileNumber}
                    </a>
                  </div>
                  {selectedEnquiry.email && (
                    <div>
                      <p className="text-[#888888] font-bold uppercase text-[10px]">Email</p>
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-accent hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                  )}
                  {selectedEnquiry.propertyType && (
                    <div>
                      <p className="text-[#888888] font-bold uppercase text-[10px]">Property Interest</p>
                      <p className="font-semibold">{selectedEnquiry.propertyType}</p>
                    </div>
                  )}
                  {selectedEnquiry.budgetRange && (
                    <div>
                      <p className="text-[#888888] font-bold uppercase text-[10px]">Budget Range</p>
                      <p className="font-semibold">{selectedEnquiry.budgetRange}</p>
                    </div>
                  )}
                  {selectedEnquiry.message && (
                    <div>
                      <p className="text-[#888888] font-bold uppercase text-[10px]">Client Message / Notes</p>
                      <p className="text-text-grey mt-1 bg-cream/40 p-2.5 rounded-lg leading-relaxed">
                        {selectedEnquiry.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Update */}
                <div className="border-t border-ivory pt-4 mb-4">
                  <p className="text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Change Lead Status</p>
                  <select
                    value={selectedEnquiry.leadStatus}
                    onChange={(e) => updateStatus(selectedEnquiry._id, e.target.value)}
                    disabled={updatingId === selectedEnquiry._id}
                    className="w-full px-3 py-2 border border-ivory rounded-lg text-xs font-semibold focus:outline-none focus:border-accent"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* WhatsApp Action */}
                <a
                  href={`https://wa.me/${selectedEnquiry.mobileNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedEnquiry.fullName}, thank you for contacting Nivesh Ventures regarding luxury real estate investments.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold uppercase tracking-wider block text-center shadow-sm transition-all"
                >
                  Message on WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-ivory p-8 text-center text-xs text-text-grey">
                Select an enquiry from the table to view full dossier, update status, and take action.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
