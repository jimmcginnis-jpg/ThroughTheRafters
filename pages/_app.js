import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import config from '../school.config';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={config.fonts.googleFontsUrl} rel="stylesheet" />
        <style>{`
          :root {
            --font-display: '${config.fonts.display}', ${config.fonts.displayFallback};
            --font-body: '${config.fonts.body}', ${config.fonts.bodyFallback};
            --font-mono: '${config.fonts.mono}', ${config.fonts.monoFallback};
            --color-primary: ${config.colors.primary};
            --color-accent: ${config.colors.accent};
            --color-accent-light: ${config.colors.accentLight};
            --color-dark: ${config.colors.dark};
            --color-cream: ${config.colors.cream};
            --color-text: ${config.colors.text};
          }
        `}</style>
      </Head>
      <Component {...pageProps} config={config} />
      <Analytics />
    </>
  );
}
