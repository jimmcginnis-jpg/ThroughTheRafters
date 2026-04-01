import Layout from '../components/Layout';
import config from '../school.config';
import data from '../data/players.json';

export default function About({ totalPlayers, profiledCount, eraCount }) {
  return (
    <Layout
      title="About This Project"
      description={`About ${config.siteName}: ${config.siteTagline} — ${config.about.intro}`}
      canonical="/about/"
    >
      <section className="bg-school-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold">About This Project</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <article className="font-body text-lg leading-relaxed space-y-6">
          <p>
            <strong className="font-display text-school-primary">{config.siteName}: {config.siteTagline}</strong> is {config.about.intro}
          </p>
          <p>{config.about.profileStructure}</p>
          <p>
            The project currently includes {totalPlayers} players across {eraCount} eras, with {profiledCount} full profiles
            complete and more in development. This is a living document that grows over time.
          </p>
          <p className="text-sm text-gray-500 italic">{config.about.disclaimer}</p>
        </article>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      totalPlayers: data.players.length,
      profiledCount: data.players.filter(p => p.status === 'done').length,
      eraCount: data.eras.length,
    },
  };
}
