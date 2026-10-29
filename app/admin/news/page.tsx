'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Market News',
    imageUrl: '',
    author: 'Nivesh Ventures Advisory',
    excerpt: '',
    content: '',
    published: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      setLoading(true);
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingSlug(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Market News',
      imageUrl: '',
      author: 'Nivesh Ventures Advisory',
      excerpt: '',
      content: '',
      published: true,
    });
    setShowForm(true);
  }

  function handleEdit(article: any) {
    setEditingSlug(article.slug);
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      category: article.category || 'Market News',
      imageUrl: article.imageUrl || '',
      author: article.author || 'Nivesh Ventures Advisory',
      excerpt: article.excerpt || article.summary || '',
      content: article.content || '',
      published: !!article.published,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        imageUrl: formData.imageUrl || undefined,
        author: formData.author,
        excerpt: formData.excerpt,
        content: formData.content,
        published: formData.published,
      };

      let res;
      if (editingSlug) {
        res = await fetch(`/api/news/${editingSlug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowForm(false);
        setEditingSlug(null);
        fetchArticles();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save article');
      }
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  }

  async function handleTogglePublish(article: any) {
    try {
      const res = await fetch(`/api/news/${article.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !article.published }),
      });
      if (res.ok) {
        fetchArticles();
      }
    } catch (e) {
      console.error('Publish toggle error:', e);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await fetch(`/api/news/${slug}`, { method: 'DELETE' });
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete:', error);
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
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">News & Intelligence Management</h1>
          </div>
          <button
            onClick={showForm ? () => setShowForm(false) : handleOpenCreate}
            className="px-5 py-2.5 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 shadow-sm"
          >
            {showForm ? 'Cancel Form' : '+ Publish Article'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-ivory mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">
              {editingSlug ? `Edit Article: ${editingSlug}` : 'Publish New Market Intelligence'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indian Luxury Real Estate Market Surges by 35% in 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Unique Slug</label>
                <input
                  type="text"
                  placeholder="auto-generated-from-title"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                >
                  <option value="Market News">Market News</option>
                  <option value="Company Updates">Company Updates</option>
                  <option value="Investment Tips">Investment Tips</option>
                  <option value="Legal Guide">Legal Guide</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Featured Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Short Excerpt / Summary</label>
                <textarea
                  rows={2}
                  placeholder="Brief 1-2 sentence overview for cards..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-ivory rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Full Article Content *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Comprehensive briefing content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                  Publish Article Publicly
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
                  {editingSlug ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-text-grey py-8 text-center">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-text-grey py-8 text-center">No articles found.</p>
        ) : (
          <div className="bg-white rounded-lg border border-ivory overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-cream border-b border-ivory font-bold uppercase text-text-grey text-[10px]">
                    <th className="px-5 py-3.5">Article Title</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Author</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory">
                  {articles.map((article) => (
                    <tr key={article._id || article.slug} className="hover:bg-cream/40 transition-colors">
                      <td className="px-5 py-4 font-bold text-text-dark">
                        <Link href={`/news/${article.slug}`} target="_blank" className="hover:text-accent">
                          {article.title}
                        </Link>
                        <span className="block text-[10px] text-text-grey font-mono mt-0.5">/{article.slug}</span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#AA771C]">{article.category || 'Intelligence'}</td>
                      <td className="px-5 py-4 text-text-grey">{article.author || 'Nivesh Advisory'}</td>
                      <td className="px-5 py-4 text-text-grey">
                        {new Date(article.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleTogglePublish(article)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                            article.published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {article.published ? 'Published ✓' : 'Draft ✕'}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right space-x-3">
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-accent font-bold uppercase text-[10px] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.slug)}
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
