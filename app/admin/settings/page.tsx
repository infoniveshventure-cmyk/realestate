'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Nivesh Ventures',
    tagline: 'Together We Grow',
    email: 'info@niveshventures.com',
    phone: '+91 98765 43210',
    whatsappNumber: '+919876543210',
    address: 'Level 14, Two Horizon Center, DLF Phase 5, Gurugram, Haryana 122002',
    facebook: 'https://facebook.com/niveshventures',
    instagram: 'https://instagram.com/niveshventures',
    linkedin: 'https://linkedin.com/company/niveshventures',
    twitter: 'https://twitter.com/niveshventures',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings({
          siteName: data.data.siteName || 'Nivesh Ventures',
          tagline: data.data.tagline || 'Together We Grow',
          email: data.data.email || 'info@niveshventures.com',
          phone: data.data.phone || '+91 98765 43210',
          whatsappNumber: data.data.whatsappNumber || '+919876543210',
          address: data.data.address || 'Two Horizon Center, DLF Phase 5, Gurugram',
          facebook: data.data.socialLinks?.facebook || 'https://facebook.com/niveshventures',
          instagram: data.data.socialLinks?.instagram || 'https://instagram.com/niveshventures',
          linkedin: data.data.socialLinks?.linkedin || 'https://linkedin.com/company/niveshventures',
          twitter: data.data.socialLinks?.twitter || 'https://twitter.com/niveshventures',
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const payload = {
        siteName: settings.siteName,
        tagline: settings.tagline,
        email: settings.email,
        phone: settings.phone,
        whatsappNumber: settings.whatsappNumber,
        address: settings.address,
        socialLinks: {
          facebook: settings.facebook,
          instagram: settings.instagram,
          linkedin: settings.linkedin,
          twitter: settings.twitter,
        },
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-ivory sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="text-accent hover:underline text-xs font-bold uppercase mb-1 block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">Website Configuration & Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all disabled:opacity-50 shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-ivory p-8 shadow-sm">
          {saved && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold uppercase tracking-wider mb-6 text-center">
              Settings and Contact Credentials Saved Successfully!
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-xs font-bold uppercase tracking-wider mb-6 text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#AA771C] border-b border-ivory pb-2">
              Site Brand & Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Tagline / Motto</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <h2 className="text-base font-bold uppercase tracking-wider text-[#AA771C] border-b border-ivory pb-2 pt-4">
              Contact & Advisory Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Official Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Primary Phone</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Headquarters Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <h2 className="text-base font-bold uppercase tracking-wider text-[#AA771C] border-b border-ivory pb-2 pt-4">
              Social Media Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">LinkedIn Profile</label>
                <input
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Instagram Handle</label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Facebook Page</label>
                <input
                  type="url"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">X / Twitter</label>
                <input
                  type="url"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-accent text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 disabled:opacity-50 mt-6 shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Settings to Database'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
