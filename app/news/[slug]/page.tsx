'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function NewsDetailPage() {
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState('');

  // Comment Form
  const [authorName, setAuthorName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentFeedback, setCommentFeedback] = useState<string | null>(null);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const currentSlug = pathSegments[pathSegments.length - 1];
    if (currentSlug && currentSlug !== 'news') {
      setSlug(currentSlug);
      fetchArticleData(currentSlug);
    }
  }, []);

  async function fetchArticleData(articleSlug: string) {
    try {
      const [artRes, allRes, commRes] = await Promise.all([
        fetch(`/api/news/${articleSlug}`),
        fetch('/api/news'),
        fetch(`/api/news/${articleSlug}/comments`),
      ]);

      const artData = await artRes.json();
      if (artData.success && artData.data) {
        setArticle(artData.data);
      }

      const allData = await allRes.json();
      if (allData.success && allData.data) {
        setRelatedArticles(allData.data.filter((a: any) => a.slug !== articleSlug).slice(0, 3));
      }

      const commData = await commRes.json();
      if (commData.success && commData.data) {
        setComments(commData.data);
      }
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !commentContent.trim() || !slug) return;
    setCommentSubmitting(true);
    setCommentFeedback(null);

    try {
      const res = await fetch(`/api/news/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName.trim(),
          content: commentContent.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setComments([data.data, ...comments]);
        setAuthorName('');
        setCommentContent('');
        setCommentFeedback('Your commentary has been published successfully.');
      } else {
        setCommentFeedback(data.error || 'Failed to submit comment.');
      }
    } catch (err) {
      setCommentFeedback('Network error.');
    } finally {
      setCommentSubmitting(false);
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
        setNewsletterStatus('Subscribed successfully!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus(data.error || 'Failed to subscribe.');
      }
    } catch (e) {
      setNewsletterStatus('Network error.');
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
          <div className="text-center">
            <span className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin inline-block mb-3" />
            <p className="font-royal text-sm text-[#AA771C] font-semibold">Loading Analysis...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
          <div className="text-center max-w-md p-8 backdrop-blur-xl bg-white/70 rounded-3xl border border-[#E6D5B8]">
            <h1 className="text-2xl font-royal font-bold text-[#111111] mb-2 uppercase">Article Not Found</h1>
            <p className="text-sm text-[#666666] mb-6">The requested publication may have been relocated.</p>
            <Link
              href="/news"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm"
            >
              Back to News →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(article.title || 'Market Insight by Nivesh Ventures');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#AA771C] hover:text-black mb-8 transition-colors"
          >
            ← Back to All News & Insights
          </Link>

          <article className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] p-8 sm:p-12 shadow-[0_10px_35px_rgba(0,0,0,0.06)] mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3.5 py-1 backdrop-blur-md bg-[#FFFBF7] border border-[#D4AF37]/40 text-[#AA771C] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                {article.category || 'Intelligence'}
              </span>
              <time className="text-xs font-semibold text-[#888888]">
                {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>

            <h1 className="font-royal text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#111111] leading-tight mb-4">
              {article.title}
            </h1>

            <div className="flex items-center justify-between text-xs font-semibold text-[#666666] pb-6 mb-8 border-b border-[#E6D5B8]">
              <span>Authored by: <strong className="text-black">{article.author || 'Nivesh Ventures Advisory'}</strong></span>
              <span>Reading Time: 3-4 mins</span>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden mb-8">
                <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
              </div>
            )}

            {/* Content Body */}
            <div className="text-sm sm:text-base text-[#444444] font-light leading-relaxed space-y-4 mb-10">
              {article.content ? (
                article.content.split('\n\n').map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p>{article.excerpt || article.summary}</p>
              )}
            </div>

            {/* Social Sharing Bar */}
            <div className="border-t border-[#E6D5B8] pt-6 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Share Intelligence:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  X / Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#0077B5] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#1877F2] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Facebook
                </a>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <section className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.06)] mb-12">
            <h2 className="font-royal text-xl sm:text-2xl font-bold uppercase text-[#111111] mb-6">
              Comments & Discussion ({comments.length})
            </h2>

            {commentFeedback && (
              <p className="mb-4 text-xs font-bold text-emerald-800 bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-200">
                {commentFeedback}
              </p>
            )}

            <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
              <div>
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Share your perspective or query..."
                  required
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <button
                type="submit"
                disabled={commentSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:scale-[1.01] transition-transform disabled:opacity-50"
              >
                {commentSubmitting ? 'Posting...' : 'Post Commentary'}
              </button>
            </form>

            <div className="space-y-4 divide-y divide-[#E6D5B8]/50">
              {comments.map((comm) => (
                <div key={comm._id} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#111111]">{comm.authorName}</span>
                    <time className="text-[10px] text-[#888888]">
                      {new Date(comm.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="text-xs text-[#555555] font-light leading-relaxed">{comm.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mb-12">
              <h3 className="font-royal text-xl font-bold uppercase text-[#111111] mb-6">Related Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((rel: any) => (
                  <Link
                    key={rel.slug}
                    href={`/news/${rel.slug}`}
                    className="backdrop-blur-xl bg-white/80 p-5 rounded-3xl border border-[#E6D5B8] hover:border-[#D4AF37] hover:shadow-md transition-all group block"
                  >
                    <span className="text-[10px] font-bold text-[#AA771C] uppercase tracking-wider block mb-1">
                      {rel.category || 'Intelligence'}
                    </span>
                    <h4 className="font-royal text-sm font-bold uppercase text-[#111111] group-hover:text-[#AA771C] transition-colors mb-2 line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[#666666] line-clamp-2 font-light">{rel.excerpt || rel.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter Box */}
          <div className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] p-8 text-center shadow-sm">
            <h4 className="font-royal text-xl font-bold uppercase text-[#111111] mb-2">Join Advisory Newsletter</h4>
            <p className="text-xs text-[#555555] mb-5">Receive timely market forecasts directly in your inbox.</p>
            {newsletterStatus && (
              <p className="mb-3 text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-xl border border-emerald-200">
                {newsletterStatus}
              </p>
            )}
            <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-white border border-[#E6D5B8] rounded-xl text-xs text-black"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
