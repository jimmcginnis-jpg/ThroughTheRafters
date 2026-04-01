// Layout.js — config-driven, school-agnostic
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import config from '../school.config';
import data from '../data/players.json';
import SearchOverlay from './SearchOverlay';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Layout({ children, title, description, canonical }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const donePlayers = data.players.filter(p => p.status === 'done');

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
    ? `${title} | ${config.siteName}: ${config.siteTagline}`
    : `${config.siteName}: ${config.siteTagline}`;

  const fullDescription = description || config.siteDescription;

  const navLinks = [
    { href: '/players/', label: 'All Players' },
    { href: '/eras/', label: 'Eras' },
    { href: '/teams/', label: 'Teams' },
    { href: '/lists/', label: 'Lists' },
    { href: '/viz/', label: 'Viz' },
    { href: '/bracket/', label: 'Bracket' },
    { href: '/what-if/', label: 'What If?' },
    { href: '/lists/x-handles/', label: 'X/Twitter' },
    { href: '/about/', label: 'About' },
  ];

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={fullDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {canonical && <link rel="canonical" href={`${config.siteUrl}${canonical}`} />}

        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={fullDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={config.siteName} />
        {canonical && <meta property="og:url" content={`${config.siteUrl}${canonical}`} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={fullDescription} />

        <link rel="icon" href="/favicon.ico" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: `${config.siteName}: ${config.siteTagline}`,
              url: `${config.siteUrl}/`,
              description: config.siteDescription,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${config.siteUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>

      {/* HEADER */}
      <header className="bg-school-dark text-white">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="group">
            <div className="font-display text-xl font-bold tracking-wide">
              <span className="text-school-accent">{config.headerLogo.line1}</span>{' '}
              <span className="text-white">{config.headerLogo.line2}</span>
            </div>
            <div className="font-mono text-xs text-school-accentLight tracking-widest">
              {config.siteTagline.toUpperCase()}
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-6 items-center font-mono text-xs tracking-wider uppercase">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-school-accentLight hover:text-school-accent transition-colors"
              title="Search players (⌘K)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-school-accentLight hover:text-school-accent transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-school-accentLight hover:text-school-accent transition-colors p-2"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 font-mono text-sm tracking-wider uppercase space-y-4">
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-school-accentLight hover:text-school-accent transition-colors py-1 w-full text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              Search Players
            </button>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-school-accentLight hover:text-school-accent transition-colors py-1">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-school-dark text-school-accentLight py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display text-school-accent text-lg mb-3">About</h3>
              <p className="font-body text-sm leading-relaxed opacity-80 mb-3">
                An independent project documenting the lives and careers of {config.school} basketball
                players, from their road to {config.city} to where they are now.
              </p>
              <div className="space-y-1 text-sm">
                <Link href="/about/" className="block hover:text-school-accent transition-colors">About This Project</Link>
                <Link href="/methodology/" className="block hover:text-school-accent transition-colors">Sources &amp; Methodology</Link>
              </div>
            </div>
            <div>
              <h3 className="font-display text-school-accent text-lg mb-3">Eras</h3>
              <div className="space-y-1 text-sm">
                {config.eras.map(era => (
                  <Link key={era.key} href={`/eras/${era.key}/`} className="block hover:text-school-accent transition-colors">
                    {era.num}. {era.name} ({era.years})
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-school-accent text-lg mb-3">Lists</h3>
              <div className="space-y-1 text-sm">
                <Link href="/lists/all-players/" className="block hover:text-school-accent transition-colors">All {data.players.length} Players</Link>
                <Link href="/lists/currently-in-nba/" className="block hover:text-school-accent transition-colors">Currently in the NBA</Link>
                <Link href="/lists/lottery-picks/" className="block hover:text-school-accent transition-colors">NBA Lottery Picks</Link>
                <Link href="/lists/mcdonalds-all-americans/" className="block hover:text-school-accent transition-colors">McDonald&rsquo;s All-Americans</Link>
                <Link href="/lists/all-americans/" className="block hover:text-school-accent transition-colors">Consensus All-Americans</Link>
                <Link href="/lists/coaches/" className="block hover:text-school-accent transition-colors">Players Who Became Coaches</Link>
                <Link href="/lists/top-nba-scorers/" className="block hover:text-school-accent transition-colors">Top NBA Scorers</Link>
                <Link href="/lists/draft-history/" className="block hover:text-school-accent transition-colors">Draft History</Link>
                <Link href="/lists/x-handles/" className="block hover:text-school-accent transition-colors">X/Twitter Handles</Link>
                <Link href="/lists/" className="block hover:text-school-accent transition-colors font-medium mt-2">All Lists &rarr;</Link>
              </div>
            </div>
            <div>
              <h3 className="font-display text-school-accent text-lg mb-3">Visualizations</h3>
              <div className="space-y-1 text-sm">
                <Link href="/viz/height/" className="block hover:text-school-accent transition-colors">All Players by Height</Link>
                <Link href="/viz/map/" className="block hover:text-school-accent transition-colors">Recruiting Map</Link>
                <Link href="/viz/nba/" className="block hover:text-school-accent transition-colors">{config.school} in the NBA</Link>
                <Link href="/viz/nba-teams/" className="block hover:text-school-accent transition-colors">{config.school} by NBA Team</Link>
                <Link href="/viz/chain/" className="block hover:text-school-accent transition-colors">{config.mascot} Chain</Link>
                <Link href="/bracket/" className="block hover:text-school-accent transition-colors">Bracket Simulator</Link>
                <Link href="/what-if/" className="block hover:text-school-accent transition-colors">What If They Stayed?</Link>
                <Link href="/viz/" className="block hover:text-school-accent transition-colors font-medium mt-2">All Viz &rarr;</Link>
              </div>
            </div>
          </div>
          <div className="era-divider mt-8 mb-4" />
          <p className="text-center text-xs opacity-60 font-mono">
            &copy; {new Date().getFullYear()} {config.copyrightHolder}. {config.about.disclaimer.split('.')[0]}.
          </p>
        </div>
      </footer>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <SpeedInsights />
    </>
  );
}
