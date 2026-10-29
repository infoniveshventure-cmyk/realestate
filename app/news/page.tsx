'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success && data.data) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewsletterStatus('Subscribed successfully to private intelligence!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus(data.error || 'Failed to subscribe.');
      }
    } catch (e) {
      setNewsletterStatus('Network error.');
    }
  }

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory ? art.category === selectedCategory : true;
    const matchesSearch = search
      ? art.title?.toLowerCase().includes(search.toLowerCase()) ||
        art.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        art.content?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">Market Intelligence</p>
            <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-4">
              News & Insights
            </h1>
            <p className="text-sm sm:text-base text-[#555555] font-light">
              Latest architectural updates, prime market trends, and high-value investment intelligence.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mb-8 backdrop-blur-2xl bg-white/70 border border-[#E6D5B8] p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/90 border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-white/90 border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin inline-block mb-3" />
              <p className="font-royal text-sm text-[#AA771C] font-semibold tracking-wider">Loading Insights...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-16 text-center backdrop-blur-md bg-white/40 rounded-3xl border border-white/60 mb-12">
              <p className="font-royal text-base text-[#666666]">No articles match your query.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                }}
                className="mt-3 text-xs font-bold text-[#AA771C] uppercase tracking-wider"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-6 mb-16">
              {filteredArticles.map((article, idx) => (
                <article
                  key={idx}
                  className="backdrop-blur-2xl bg-white/75 rounded-3xl border border-[#E6D5B8] p-7 sm:p-9 shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:border-[#D4AF37] hover:shadow-[0_15px_45px_rgba(212,175,55,0.2)] hover:-translate-y-1 transition-all duration-400 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3.5 py-1 backdrop-blur-md bg-white/90 border border-[#D4AF37]/40 text-[#AA771C] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {article.category || 'Intelligence'}
                    </span>
                    <time className="text-xs font-semibold text-[#888888]">
                      {new Date(article.createdAt || article.date || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h2 className="font-royal text-xl sm:text-2xl font-bold uppercase text-[#111111] group-hover:text-[#AA771C] transition-colors mb-2 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-[#555555] font-light mb-5 leading-relaxed">
                    {article.excerpt || article.summary || (article.content ? article.content.slice(0, 160) + '...' : '')}
                  </p>
                  <Link
                    href={article.slug ? `/news/${article.slug}` : '#'}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#AA771C] hover:text-black group-hover:translate-x-1 transition-all"
                  >
                    Read Full Analysis →
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Newsletter Subscription Card */}
          <div className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] p-8 sm:p-12 text-center shadow-sm">
            <p className="font-script text-3xl sm:text-4xl text-[#AA771C] mb-1">Direct Insights</p>
            <h3 className="font-royal text-2xl sm:text-3xl font-black uppercase text-[#111111] tracking-wider mb-2">
              Subscribe to Private Briefings
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] font-light max-w-lg mx-auto mb-6">
              Receive quarterly off-market estate intelligence, luxury micro-market reports, and acquisition alerts.
            </p>

            {newsletterStatus && (
              <p className="mb-4 text-xs font-bold text-emerald-700 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
                {newsletterStatus}
              </p>
            )}

            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-sm hover:scale-105 transition-all"
              >
                Join Briefing
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
