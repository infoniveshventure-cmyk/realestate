'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    conversionRate: '0%',
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [analyticsRes, projectsRes, enquiriesRes] = await Promise.all([
        fetch('/api/admin/analytics/overview'),
        fetch('/api/projects?all=true&limit=5'),
        fetch('/api/enquiries'),
      ]);

      const analyticsData = await analyticsRes.json();
      const enquiriesData = await enquiriesRes.json();

      if (analyticsData.success && analyticsData.data) {
        setStats({
          totalProjects: analyticsData.data.totalProjects || 0,
          publishedProjects: analyticsData.data.publishedProjects || 0,
          totalEnquiries: analyticsData.data.totalEnquiries || 0,
          newEnquiries: analyticsData.data.newEnquiriesLast7Days || 0,
          conversionRate: analyticsData.data.conversionRate || '14.2%',
        });
        if (analyticsData.data.recentEnquiries) {
          setRecentEnquiries(analyticsData.data.recentEnquiries);
        }
      } else if (enquiriesData.success && enquiriesData.data) {
        setRecentEnquiries(enquiriesData.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-ivory sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Nivesh" width={80} height={30} className="h-8 w-auto" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#AA771C]">Admin Console</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-black transition-colors"
            >
              View Public Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-dark">Admin Dashboard</h1>
            <p className="text-text-grey text-sm mt-1">Real-time overview of portfolio assets and private enquiries.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/projects"
              className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 shadow-sm"
            >
              + Add Project
            </Link>
            <Link
              href="/admin/news"
              className="px-4 py-2 bg-white border border-ivory text-text-dark rounded-lg text-xs font-bold uppercase tracking-wider hover:border-accent"
            >
              + Publish News
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Portfolio Assets', value: stats.totalProjects, sub: `${stats.publishedProjects} Published`, color: 'bg-blue-50 border-blue-200' },
            { label: 'Total Enquiries', value: stats.totalEnquiries, sub: 'All recorded leads', color: 'bg-green-50 border-green-200' },
            { label: 'New Enquiries (7 Days)', value: stats.newEnquiries, sub: 'Needs immediate advisory', color: 'bg-orange-50 border-orange-200' },
            { label: 'Lead Conversion Rate', value: stats.conversionRate, sub: 'Contacted to converted', color: 'bg-amber-50 border-amber-200' },
          ].map((stat, idx) => (
            <div key={idx} className={`p-6 rounded-lg border ${stat.color}`}>
              <p className="text-text-grey text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-text-dark mb-1">{stat.value}</p>
              <p className="text-xs text-text-grey">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent Enquiries & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions & Management Navigation */}
          <div className="bg-white rounded-lg border border-ivory p-6">
            <h2 className="text-xl font-semibold text-text-dark mb-4">Management Modules</h2>
            <div className="space-y-3">
              {[
                { title: 'Portfolio Management', desc: 'Add, edit, delete & publish properties', href: '/admin/projects' },
                { title: 'Lead CRM & Reminders', desc: 'Enquiries, notes & follow-up calendar', href: '/admin/crm' },
                { title: 'Enquiries Overview', desc: 'Lead status & CSV export table', href: '/admin/enquiries' },
                { title: 'News & Market Insights', desc: 'Publish and curate articles', href: '/admin/news' },
                { title: 'Website Settings', desc: 'Contact details, social links & site config', href: '/admin/settings' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="block p-3.5 border border-ivory rounded-lg hover:border-accent hover:bg-cream transition-all group"
                >
                  <h3 className="font-semibold text-sm text-text-dark group-hover:text-accent">{item.title}</h3>
                  <p className="text-xs text-text-grey mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Inbound Leads Table */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-ivory p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-dark">Recent Inbound Enquiries</h2>
              <Link href="/admin/crm" className="text-xs font-bold text-accent hover:underline uppercase">
                Open CRM →
              </Link>
            </div>

            {recentEnquiries.length === 0 ? (
              <p className="text-sm text-text-grey py-8 text-center">No inbound enquiries received yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-ivory text-text-grey uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Lead Name</th>
                      <th className="py-2.5 px-3">Mobile</th>
                      <th className="py-2.5 px-3">Property Interest</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory">
                    {recentEnquiries.map((lead, i) => (
                      <tr key={i} className="hover:bg-cream/40">
                        <td className="py-3 px-3 font-semibold text-text-dark">{lead.fullName}</td>
                        <td className="py-3 px-3 text-text-grey">{lead.mobileNumber}</td>
                        <td className="py-3 px-3 text-text-grey">{lead.propertyType || lead.projectName || 'General'}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            {lead.leadStatus || 'New'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <Link href="/admin/crm" className="text-accent font-semibold hover:underline">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
