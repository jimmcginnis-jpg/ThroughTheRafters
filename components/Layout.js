import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import data from '../data/players.json';

export default function Layout({ children, title, description, canonical }) {
  const router = useRouter();
  const donePlayers = data.players.filter(p => p.status === 'done');

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
        {canonical && <link rel="canonical" href={`https://dukebrotherhood.com${canonical}`} />}

        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={fullDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Duke's Brotherhood" />
        {canonical && <meta property="og:url" content={`https://dukebrotherhood.com${canonical}`} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={fullDescription} />

        <link rel="icon" href="/favicon.ico" />
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

          <div className="flex gap-6 items-center font-mono text-xs tracking-wider uppercase">
            <button
              onClick={goToRandomPlayer}
              className="bg-duke-gold text-duke-navyDark px-3 py-1.5 hover:bg-duke-goldLight transition-colors cursor-pointer"
              title="Random Player Generator — inspired by Wilco"
            >
              &#9861; Random Player
            </button>
            <Link href="/players/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              All Players
            </Link>
            <Link href="/eras/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              Eras
            </Link>
            <Link href="/about/" className="text-duke-goldLight hover:text-duke-gold transition-colors">
              About
            </Link>
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-duke-slate text-duke-goldLight py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
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
    </>
  );
}
