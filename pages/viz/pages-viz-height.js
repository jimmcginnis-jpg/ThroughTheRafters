// pages/viz/height.js
// Drop this into pages/viz/

import { useState } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import data from "../../data/players.json";

// Parse height string to inches
function parseHeight(h) {
  if (!h) return null;
  const norm = h.replace(/[\u2018\u2019\u0060\u00B4]/g, "'").replace(/[\u201C\u201D\u0022\u201C\u201D]/g, '"');
  const match = norm.match(/(\d+)[']\s*(\d+)/);
  if (match) return parseInt(match[1]) * 12 + parseInt(match[2]);
  return null;
}

// Build distribution from live data
function buildDistribution(players) {
  const withHeight = players
    .filter(p => p.height && p.height !== "")
    .map(p => ({ ...p, inches: parseHeight(p.height) }))
    .filter(p => p.inches);

  const buckets = {};
  withHeight.forEach(p => {
    const ft = Math.floor(p.inches / 12);
    const inch = p.inches % 12;
    const label = `${ft}'${inch}"`;
    if (!buckets[label]) buckets[label] = { label, inches: p.inches, count: 0, profiled: 0, stub: 0, players: [] };
    buckets[label].count++;
    buckets[label][p.status === "done" ? "profiled" : "stub"]++;
    buckets[label].players.push({ name: p.name, status: p.status, slug: p.slug });
  });

  return Object.values(buckets).sort((a, b) => a.inches - b.inches);
}

export default function HeightViz() {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

  const dist = buildDistribution(data.players);
  const maxCount = Math.max(...dist.map(d => d.count));
  const totalMeasured = dist.reduce((s, d) => s + d.count, 0);
  const totalProfiled = data.players.filter(p => p.status === "done").length;
  const totalStub = data.players.filter(p => p.status === "stub").length;

  const active = selectedBar !== null ? selectedBar : hoveredBar;

  // Find shortest, tallest, most common
  const shortest = dist[0];
  const tallest = dist[dist.length - 1];
  const mostCommon = dist.reduce((a, b) => a.count > b.count ? a : b);

  return (
    <Layout
      title="All Players by Height"
      description="Interactive visualization of all 219 Duke basketball players by height, from 1981 to present."
      canonical="/viz/height/"
    >
      <Head>
        <meta property="og:title" content="Duke Brotherhood — All Players by Height" />
      </Head>

      <div className="bg-duke-slate py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <nav className="font-mono text-xs text-duke-goldLight mb-6 tracking-wider">
            <a href="/" className="hover:text-duke-gold">Home</a>
            <span className="mx-2">/</span>
            <span className="text-duke-gold">Height Visualization</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
            All Players by Height
          </h1>
          <p className="font-body text-duke-goldLight text-lg mb-6">
            {totalMeasured} Duke basketball players measured, 1981&ndash;2026
          </p>

          <div className="flex gap-5 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-duke-gold rounded-sm" />
              <span className="font-mono text-xs text-duke-gold">Profiled ({totalProfiled})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm" style={{ background: "#2a4a7f" }} />
              <span className="font-mono text-xs" style={{ color: "#8ba4c7" }}>Roster ({totalStub})</span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex items-end gap-1 md:gap-1.5" style={{ height: 320, paddingBottom: 32 }}>
            {dist.map((d, i) => {
              const profiledH = (d.profiled / maxCount) * 260;
              const stubH = (d.stub / maxCount) * 260;
              const isActive = active === i;

              return (
                <div
                  key={d.label}
                  className="flex-1 flex flex-col items-center cursor-pointer relative"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onClick={() => setSelectedBar(selectedBar === i ? null : i)}
                >
                  <div
                    className="font-mono mb-1 transition-all duration-150"
                    style={{
                      fontSize: 11,
                      color: isActive ? "#C5A258" : "#8ba4c7",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {d.count}
                  </div>

                  <div className="w-full flex flex-col justify-end">
                    <div
                      className="rounded-t transition-all duration-150"
                      style={{
                        height: stubH,
                        background: isActive ? "#3a6abf" : "#2a4a7f",
                        opacity: isActive ? 1 : 0.85,
                        borderRadius: d.profiled === 0 ? "3px 3px 0 0" : "3px 3px 0 0",
                      }}
                    />
                    <div
                      className="transition-all duration-150"
                      style={{
                        height: profiledH,
                        background: isActive ? "#d4b366" : "#C5A258",
                        borderRadius: d.stub === 0 ? "3px 3px 0 0" : 0,
                      }}
                    />
                  </div>

                  <div
                    className="font-mono mt-1.5 whitespace-nowrap transition-all duration-150"
                    style={{
                      fontSize: 10,
                      color: isActive ? "#C5A258" : "#6b83a5",
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    {d.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Player names panel */}
          {active !== null && (
            <div className="rounded-lg p-4 md:p-5 mt-2" style={{ background: "#111d33", border: "1px solid #2a4a7f" }}>
              <div className="font-display text-duke-gold text-lg font-bold mb-3">
                {dist[active].label} &mdash; {dist[active].count} player{dist[active].count !== 1 ? "s" : ""}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dist[active].players.map(p => (
                  p.status === "done" ? (
                    <a
                      key={p.name}
                      href={`/players/${p.slug}/`}
                      className="inline-block px-2.5 py-1 rounded text-sm font-semibold transition-colors"
                      style={{
                        background: "rgba(197,162,88,0.15)",
                        color: "#C5A258",
                        border: "1px solid rgba(197,162,88,0.3)",
                      }}
                    >
                      {p.name}
                    </a>
                  ) : (
                    <span
                      key={p.name}
                      className="inline-block px-2.5 py-1 rounded text-sm"
                      style={{
                        background: "rgba(42,74,127,0.3)",
                        color: "#8ba4c7",
                        border: "1px solid rgba(42,74,127,0.4)",
                      }}
                    >
                      {p.name}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}

          {active === null && (
            <p className="font-body text-center text-sm mt-4" style={{ color: "#6b83a5", fontStyle: "italic" }}>
              Hover or tap a bar to see players at that height
            </p>
          )}

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { label: "Shortest", value: shortest.label, sub: shortest.players[0].name },
              { label: "Tallest", value: tallest.label, sub: tallest.players[0].name },
              { label: "Most Common", value: mostCommon.label, sub: `${mostCommon.count} players` },
              { label: "Total Measured", value: totalMeasured, sub: "of 238 roster" },
            ].map(s => (
              <div key={s.label} className="rounded-lg text-center py-3 px-2" style={{ background: "#111d33" }}>
                <div className="font-mono text-xs uppercase tracking-wider" style={{ color: "#6b83a5" }}>{s.label}</div>
                <div className="font-display text-duke-gold text-2xl font-bold my-1">{s.value}</div>
                <div className="font-mono text-xs" style={{ color: "#8ba4c7" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
