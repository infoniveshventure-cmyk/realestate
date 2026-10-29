'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    location: '',
    propertyType: 'Residential',
    status: 'Upcoming',
    price: '',
    size: '',
    units: '',
    amenities: '',
    imageUrl: '',
    brochureUrl: '',
    description: '',
    published: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await fetch('/api/projects?all=true&limit=50');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingSlug(null);
    setFormData({
      name: '',
      slug: '',
      location: '',
      propertyType: 'Residential',
      status: 'Upcoming',
      price: '',
      size: '',
      units: '',
      amenities: '',
      imageUrl: '',
      brochureUrl: '',
      description: '',
      published: false,
    });
    setShowForm(true);
  }

  function handleEdit(project: any) {
    setEditingSlug(project.slug);
    setFormData({
      name: project.name || '',
      slug: project.slug || '',
      location: project.location || '',
      propertyType: project.propertyType || 'Residential',
      status: project.status || 'Upcoming',
      price: project.price ? String(project.price) : '',
      size: project.size ? String(project.size) : '',
      units: project.units ? String(project.units) : '',
      amenities: project.amenities ? project.amenities.join(', ') : '',
      imageUrl: project.images?.[0]?.url || '',
      brochureUrl: project.brochureUrl || '',
      description: project.description || '',
      published: !!project.published,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        location: formData.location,
        propertyType: formData.propertyType,
        status: formData.status,
        description: formData.description,
        published: formData.published,
      };

      if (formData.price) payload.price = parseFloat(formData.price);
      if (formData.size) payload.size = parseFloat(formData.size);
      if (formData.units) payload.units = parseInt(formData.units);
      if (formData.amenities) {
        payload.amenities = formData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean);
      }
      if (formData.imageUrl) {
        payload.images = [{ url: formData.imageUrl, alt: formData.name, cloudinaryId: 'admin-upload' }];
      }
      if (formData.brochureUrl) payload.brochureUrl = formData.brochureUrl;

      let res;
      if (editingSlug) {
        res = await fetch(`/api/projects/${editingSlug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowForm(false);
        setEditingSlug(null);
        fetchProjects();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  }

  async function handleTogglePublish(project: any) {
    try {
      const res = await fetch(`/api/projects/${project.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !project.published }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (e) {
      console.error('Publish toggle error:', e);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/projects/${slug}`, { method: 'DELETE' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-ivory sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="text-accent hover:underline text-xs font-bold uppercase mb-1 block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">Portfolio Management</h1>
          </div>
          <button
            onClick={showForm ? () => setShowForm(false) : handleOpenCreate}
            className="px-5 py-2.5 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-sm"
          >
            {showForm ? 'Cancel Form' : '+ Add New Property'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-ivory mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">
              {editingSlug ? `Edit Property: ${editingSlug}` : 'Create New Portfolio Asset'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Heights Residences"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Unique Slug</label>
                <input
                  type="text"
                  placeholder="auto-generated-from-name"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Location / Micro-market *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra West, Mumbai"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Plot">Plot & Land</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Development Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                >
                  <option value="Upcoming">Upcoming (Pre-Launch)</option>
                  <option value="Ongoing">Ongoing (Under Construction)</option>
                  <option value="Completed">Completed (Ready to Move)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Price (in INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 65000000 (₹6.5 Cr)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Built-up Area (sq ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 2800"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Residences / Units</label>
                <input
                  type="number"
                  placeholder="e.g. 48"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Primary Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Brochure PDF URL</label>
                <input
                  type="text"
                  placeholder="/brochures/property.pdf"
                  value={formData.brochureUrl}
                  onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Infinity Pool, Private Elevators, 24/7 Concierge, Italian Marble"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Architectural Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Highlight key materials, architectural philosophy, layout, and connectivity..."
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 accent-accent"
                />
                <label htmlFor="published" className="text-xs font-bold uppercase tracking-wider text-text-dark">
                  Publish to Public Website
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-ivory">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 border border-ivory rounded-lg text-xs font-bold uppercase tracking-wider text-text-grey hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 shadow-sm"
                >
                  {editingSlug ? 'Save Changes' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {loading ? (
          <p className="text-text-grey py-8 text-center">Loading assets...</p>
        ) : projects.length === 0 ? (
          <p className="text-text-grey py-8 text-center">No projects in database.</p>
        ) : (
          <div className="bg-white rounded-lg border border-ivory overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-cream border-b border-ivory font-bold uppercase text-text-grey text-[10px]">
                    <th className="px-5 py-3.5">Property</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Stage</th>
                    <th className="px-5 py-3.5">Valuation</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory">
                  {projects.map((project: any) => (
                    <tr key={project._id || project.slug} className="hover:bg-cream/40 transition-colors">
                      <td className="px-5 py-4 font-bold text-text-dark">
                        <Link href={`/projects/${project.slug}`} target="_blank" className="hover:text-accent">
                          {project.name}
                        </Link>
                        <span className="block text-[10px] text-text-grey font-mono mt-0.5">/{project.slug}</span>
                      </td>
                      <td className="px-5 py-4 text-text-grey">{project.location}</td>
                      <td className="px-5 py-4 font-semibold">{project.propertyType}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#AA771C] rounded-full text-[10px] font-bold">
                          {project.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-text-dark">
                        {project.price ? `₹${(project.price / 10000000).toFixed(2)} Cr` : 'On Request'}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleTogglePublish(project)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                            project.published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {project.published ? 'Published ✓' : 'Draft ✕'}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right space-x-3">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-accent font-bold uppercase text-[10px] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.slug)}
                          className="text-red-500 font-bold uppercase text-[10px] hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
