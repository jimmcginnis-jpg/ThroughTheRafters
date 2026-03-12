// Layout.js — updated 2026-03-09
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import data from '../data/players.json';
import SearchOverlay from './SearchOverlay';

export default function Layout({ children, title, description, canonical }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const donePlayers = data.players.filter(p => p.status === 'done');

  // Cmd+K / Ctrl+K keyboard shortcut to open search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const goToRandomPlayer = () => {
    const random = donePlayers[Math.floor(Math.random() * donePlayers.length)];
    router.push(`/players/${random.slug}/`);
  };
  const fullTitle = title
    ? `${title} | Duke's Brotherhood: Where Are They Now?`
    : "Duke's Brotherhood: Where Are They Now?";

  const fullDescription = description ||
    "The complete documentary profile series covering every significant player in Duke basketball history under Coach K and beyond.";

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={fullDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {canonical && <link rel="canonical" href={`https://www.dukebrotherhood.com${canonical}`} />}

        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={fullDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Duke's Brotherhood" />
        {canonical && <meta property="og:url" content={`https://www.dukebrotherhood.com${canonical}`} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={fullDescription} />

        <link rel="icon" href="/favicon.ico" />

        {/* Site-wide Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: "Duke's Brotherhood: Where Are They Now?",
              url: 'https://www.dukebrotherhood.com/',
              description: "Comprehensive profiles of every significant Duke basketball player from 1981 to present — where they came from, what made them special, and where they are now.",
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.dukebrotherhood.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>

      {/* HEADER */}
      <header className="bg-duke-slate text-white">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="group">
            <div className="font-display text-xl font-bold tracking-wide">
              <span className="text-duke-gold">DUKE&rsquo;S</span>{' '}
              <span className="text-white">BROTHERHOOD</span>
            </div>
            <div className="font-mono text-xs text-duke-goldLight tracking-widest">
              WHERE ARE THEY NOW?
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-6 items-center font-mono text-xs tracking-wider uppercase">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-duke-goldLight hover:text-duke-gold transition-colors"
              title="Search players (⌘K)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
            <Link href="/players/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              All Players
            </Link>
            <Link href="/eras/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              Eras
            </Link>
            <Link href="/teams/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              Teams
            </Link>
            <Link href="/lists/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              Lists
            </Link>
            <Link href="/viz/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              Viz
            </Link>
            <Link href="/about/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              About
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-duke-goldLight hover:text-duke-gold transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 font-mono text-sm tracking-wider uppercase space-y-4">
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-duke-goldLight hover:text-duke-gold transition-colors py-1 w-full text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              Search Players
            </button>
            <Link href="/players/" onClick={() => setMobileMenuOpen(false)} className="block text-duke-goldLight hover:text-duke-gold transition-colors py-1">
              All Players
            </Link>
            <Link href="/eras/" onClick={() => setMobileMenuOpen(false)} className="block text-duke-goldLight hover:text-duke-gold transition-colors py-1">
              Eras
            </Link>
            <Link href="/teams/" onClick={() => setMobileMenuOpen(false)} className="block text-duke-goldLight hover:text-duke-gold transition-colors py-1">
              Teams
            </Link>
            <Link href="/lists/" onClick={() => setMobileMenuOpen(false)} className="block text-duke-goldLight hover:text-duke-gold transition-colors py-1">
              Lists
            </Link>
            <Link href="/viz/" onClick={() => setMobileMenuOpen(false)} className="block text-duke-goldLight hover:text-duke-gold transition-colors py-1">
              Viz
            </Link>
            <Link href="/about/" onClick={() => setMobileMenuOpen(false)} className="block text-duke-goldLight hover:text-duke-gold transition-colors py-1">
              About
            </Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-duke-slate text-duke-goldLight py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display text-duke-gold text-lg mb-3">Duke&rsquo;s Brotherhood</h3>
              <p className="font-body text-sm leading-relaxed opacity-80">
                A comprehensive documentary profile series covering every significant player
                across eight eras of Duke basketball.
              </p>
            </div>
            <div>
              <h3 className="font-display text-duke-gold text-lg mb-3">Eras</h3>
              <div className="space-y-1 text-sm">
                <Link href="/eras/foundation/" className="block hover:text-duke-gold transition-colors">I. Foundation (1981–85)</Link>
                <Link href="/eras/dynasty1/" className="block hover:text-duke-gold transition-colors">II. First Dynasty (1986–94)</Link>
                <Link href="/eras/transition/" className="block hover:text-duke-gold transition-colors">III. Transition (1995–98)</Link>
                <Link href="/eras/dynasty2/" className="block hover:text-duke-gold transition-colors">IV. Second Dynasty (1999–04)</Link>
                <Link href="/eras/between/" className="block hover:text-duke-gold transition-colors">V. In Between (2005–09)</Link>
                <Link href="/eras/resurgence/" className="block hover:text-duke-gold transition-colors">VI. Resurgence (2010–15)</Link>
                <Link href="/eras/superteam/" className="block hover:text-duke-gold transition-colors">VII. Superteam Era (2016–22)</Link>
                <Link href="/eras/scheyer/" className="block hover:text-duke-gold transition-colors">VIII. The Scheyer Era (2022–)</Link>
              </div>
            </div>
            <div>
              <h3 className="font-display text-duke-gold text-lg mb-3">Lists</h3>
              <div className="space-y-1 text-sm">
                <Link href="/lists/all-players/" className="block hover:text-duke-gold transition-colors">All {data.players.length} Players</Link>
                <Link href="/lists/currently-in-nba/" className="block hover:text-duke-gold transition-colors">Currently in the NBA</Link>
                <Link href="/lists/lottery-picks/" className="block hover:text-duke-gold transition-colors">NBA Lottery Picks</Link>
                <Link href="/lists/mcdonalds-all-americans/" className="block hover:text-duke-gold transition-colors">McDonald&rsquo;s All-Americans</Link>
                <Link href="/lists/coaches/" className="block hover:text-duke-gold transition-colors">Players Who Became Coaches</Link>
                <Link href="/lists/top-nba-scorers/" className="block hover:text-duke-gold transition-colors">Top NBA Scorers</Link>
                <Link href="/lists/draft-history/" className="block hover:text-duke-gold transition-colors">Draft History</Link>
                <Link href="/lists/" className="block hover:text-duke-gold transition-colors font-medium mt-2">All Lists &rarr;</Link>
              </div>
            </div>
            <div>
              <h3 className="font-display text-duke-gold text-lg mb-3">About</h3>
              <p className="text-sm leading-relaxed opacity-80 mb-3">
                An independent project documenting the lives and careers of Duke basketball
                players, from their road to Durham to where they are now.
              </p>
              <div className="space-y-1 text-sm">
                <Link href="/about/" className="block hover:text-duke-gold transition-colors">About This Project</Link>
                <Link href="/methodology/" className="block hover:text-duke-gold transition-colors">Sources &amp; Methodology</Link>
              </div>
            </div>
          </div>
          <div className="era-divider mt-8 mb-4" />
          <p className="text-center text-xs opacity-60 font-mono">
            &copy; {new Date().getFullYear()} Duke&rsquo;s Brotherhood. Not affiliated with Duke University.
          </p>
        </div>
      </footer>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
