import config from '../../school.config';
// pages/viz/chain.js
// Wildcats Chain — Degrees of Separation between any two Kentucky players

import { useState, useMemo, useRef, useEffect } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import data from "../../data/players.json";

/* ── helpers ── */

function parseYears(str) {
  if (!str) return [];
  const clean = str.replace(/[–—-]/g, "-");
  const match = clean.match(/(\d{4})\s*-\s*(\d{2,4})/);
  if (!match) return [];
  const start = parseInt(match[1]);
  let end = parseInt(match[2]);
  if (end < 100) end += Math.floor(start / 100) * 100;
  if (end < start) end += 100;
  const years = [];
  for (let y = start; y < end; y++) years.push(y);
  return years;
}

function seasonLabel(y) {
  return `${y}-${String(y + 1).slice(-2)}`;
}

/* ── precompute graph at module level ── */

const allPlayers = data.players
  .map((p) => ({ ...p, parsedYears: parseYears(p.years) }))
  .filter((p) => p.parsedYears.length > 0);

const playerMap = {};
allPlayers.forEach((p) => { playerMap[p.id] = p; });

const adj = {};
allPlayers.forEach((p) => { adj[p.id] = new Set(); });
for (let i = 0; i < allPlayers.length; i++) {
  for (let j = i + 1; j < allPlayers.length; j++) {
    const a = allPlayers[i], b = allPlayers[j];
    if (a.parsedYears.some((y) => b.parsedYears.includes(y))) {
      adj[a.id].add(b.id);
      adj[b.id].add(a.id);
    }
  }
}

function bfs(startId, endId) {
  if (!adj[startId] || !adj[endId]) return null;
  if (startId === endId) return [startId];
  const visited = new Set([startId]);
  const queue = [[startId, [startId]]];
  while (queue.length > 0) {
    const [current, path] = queue.shift();
    for (const neighbor of adj[current]) {
      if (!visited.has(neighbor)) {
        const newPath = [...path, neighbor];
        if (neighbor === endId) return newPath;
        visited.add(neighbor);
        queue.push([neighbor, newPath]);
      }
    }
  }
  return null;
}

function sharedSeasons(id1, id2) {
  const a = playerMap[id1], b = playerMap[id2];
  if (!a || !b) return [];
  return a.parsedYears.filter((y) => b.parsedYears.includes(y)).map(seasonLabel);
}

/* ── famous pairs ── */

const FAMOUS_PAIRS = [
  { label: "Vince Taylor → Cooper Flagg", a: "taylor_v", b: "flagg", desc: "The Full Chain (1978 to 2025)" },
  { label: "Dawkins → Flagg", a: "dawkins", b: "flagg", desc: "The entire Calipari era" },
  { label: "Laettner → Zion", a: "laettner", b: "zion", desc: "Villain to phenomenon" },
  { label: "Hurley → Redick", a: "hurley", b: "redick", desc: "Point guard to shooter" },
  { label: "Grant Hill → Scheyer", a: "hill", b: "scheyer", desc: "Player to coach" },
  { label: "Jay Williams → Flagg", a: "jay_williams", b: "flagg", desc: "Tragedy to promise" },
  { label: "Laettner → Flagg", a: "laettner", b: "flagg", desc: "1988 to 2024" },
];

/* ── autocomplete component ── */

function PlayerPicker({ value, onChange, label, excludeId }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return allPlayers
      .filter((p) => p.id !== excludeId && p.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, excludeId]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = value ? playerMap[value] : null;

  return (
    <div ref={ref} className="relative flex-1">
      <label className="block font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "#6b83a5" }}>
        {label}
      </label>
      {selected && !open ? (
        <button
          onClick={() => { setOpen(true); setQuery(""); }}
          className="w-full text-left px-4 py-3 rounded-lg font-display text-lg transition-all"
          style={{ background: "rgba(197,162,88,0.12)", border: "1px solid rgba(197,162,88,0.4)", color: "#C5A258" }}
        >
          <span className="font-bold">{selected.name}</span>
          <span className="font-mono text-xs ml-2 opacity-70">{selected.years}</span>
        </button>
      ) : (
        <input
          type="text"
          autoFocus={open}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Type a player name..."
          className="w-full px-4 py-3 rounded-lg font-body text-white placeholder-gray-500 outline-none transition-all"
          style={{ background: "#111d33", border: "1px solid #2a4a7f" }}
        />
      )}
      {open && filtered.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-lg overflow-hidden shadow-xl"
          style={{ background: "#111d33", border: "1px solid #2a4a7f" }}
        >
          {filtered.map((p) => {
            const era = data.eras?.find((e) => e.key === p.era);
            return (
              <button
                key={p.id}
                onClick={() => { onChange(p.id); setQuery(""); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span className="text-white font-body">{p.name}</span>
                <span className="font-mono text-xs" style={{ color: "#6b83a5" }}>
                  {p.years}{era ? ` · ${era.name}` : ""}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── chain link visual ── */

function ChainLink({ fromId, toId, index, isLast }) {
  const from = playerMap[fromId];
  const to = playerMap[toId];
  const shared = sharedSeasons(fromId, toId);
  const fromEra = data.eras?.find((e) => e.key === from?.era);

  return (
    <div className="relative">
      {/* Player node */}
      <div className="flex items-start gap-4">
        {/* Step number + connector line */}
        <div className="flex flex-col items-center" style={{ minWidth: 36 }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm font-bold shrink-0"
            style={{
              background: from?.status === "done" || from?.status === "pledged" ? "rgba(197,162,88,0.2)" : "rgba(42,74,127,0.3)",
              color: from?.status === "done" || from?.status === "pledged" ? "#C5A258" : "#8ba4c7",
              border: `2px solid ${from?.status === "done" || from?.status === "pledged" ? "rgba(197,162,88,0.5)" : "rgba(42,74,127,0.5)"}`,
            }}
          >
            {index}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 my-1" style={{ minHeight: 40, background: "linear-gradient(to bottom, rgba(197,162,88,0.4), rgba(42,74,127,0.3))" }} />
          )}
        </div>

        {/* Player info */}
        <div className="pb-4 flex-1" style={{ minHeight: isLast ? "auto" : 70 }}>
          {from?.status === "done" || from?.status === "pledged" ? (
            <a href={`/players/${from.slug}/`} className="font-display text-lg font-bold hover:underline" style={{ color: "#C5A258" }}>
              {from?.name}
            </a>
          ) : (
            <span className="font-display text-lg font-bold" style={{ color: "#8ba4c7" }}>
              {from?.name}
            </span>
          )}
          <div className="font-mono text-xs mt-0.5" style={{ color: "#6b83a5" }}>
            {from?.years}
            {fromEra ? <span className="opacity-60"> · {fromEra.name}</span> : ""}
          </div>

          {/* Shared seasons connector */}
          {!isLast && shared.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="font-mono text-xs" style={{ color: "#4a7a4a" }}>
                teammates
              </span>
              <div className="flex flex-wrap gap-1">
                {shared.map((s) => (
                  <span
                    key={s}
                    className="inline-block px-2 py-0.5 rounded font-mono text-xs"
                    style={{ background: "rgba(74,122,74,0.15)", color: "#7ab87a", border: "1px solid rgba(74,122,74,0.3)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── main page ── */

export default function ChainViz() {
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);

  const chain = useMemo(() => {
    if (!playerA || !playerB) return null;
    return bfs(playerA, playerB);
  }, [playerA, playerB]);

  const degrees = chain ? chain.length - 1 : null;

  const handleFamousPair = (pair) => {
    setPlayerA(pair.a);
    setPlayerB(pair.b);
  };

  const handleSwap = () => {
    setPlayerA(playerB);
    setPlayerB(playerA);
  };

  return (
    <Layout
      title="Wildcats Chain — Degrees of Separation"
      description={`Every Kentucky basketball player since 1978 is connected through shared rosters. Find the shortest chain of teammates between any two Wildcats.`}
      canonical="/viz/chain/"
    >
      <Head>
        <meta property="og:title" content="Wildcats Chain — Degrees of Separation | Through the Rafters" />
      </Head>

      <div className="bg-school-dark py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">

          {/* Header */}
          <nav className="font-mono text-xs text-school-accentLight mb-6 tracking-wider">
            <a href="/" className="hover:text-school-accent">Home</a>
            <span className="mx-2">/</span>
            <a href="/viz/" className="hover:text-school-accent">Viz</a>
            <span className="mx-2">/</span>
            <span className="text-school-accent">Wildcats Chain</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Wildcats Chain
          </h1>
          <p className="font-body text-school-accentLight text-lg mb-2">
            Degrees of separation between any two Kentucky players
          </p>
          <p className="font-body text-sm mb-8" style={{ color: "#6b83a5" }}>
            Every Kentucky basketball player since 1978 is connected through shared rosters.
            Pick two players and see the shortest chain of teammates linking them &mdash;
            the living proof that Through the Rafters is real.
          </p>

          {/* Player selectors */}
          <div className="flex flex-col md:flex-row gap-3 items-end mb-4">
            <PlayerPicker
              label="From"
              value={playerA}
              onChange={setPlayerA}
              excludeId={playerB}
            />

            <button
              onClick={handleSwap}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full mb-1 transition-colors"
              style={{ background: "rgba(42,74,127,0.3)", color: "#8ba4c7" }}
              title="Swap players"
            >
              ⇄
            </button>

            <PlayerPicker
              label="To"
              value={playerB}
              onChange={setPlayerB}
              excludeId={playerA}
            />
          </div>

          {/* Famous pairs */}
          <div className="mb-10">
            <div className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: "#6b83a5" }}>
              Try a famous pair
            </div>
            <div className="flex flex-wrap gap-2">
              {FAMOUS_PAIRS.map((pair) => (
                <button
                  key={pair.label}
                  onClick={() => handleFamousPair(pair)}
                  className="px-3 py-1.5 rounded-full font-mono text-xs transition-all hover:scale-105"
                  style={{
                    background: playerA === pair.a && playerB === pair.b
                      ? "rgba(197,162,88,0.2)"
                      : "rgba(42,74,127,0.2)",
                    color: playerA === pair.a && playerB === pair.b ? "#C5A258" : "#8ba4c7",
                    border: `1px solid ${playerA === pair.a && playerB === pair.b
                      ? "rgba(197,162,88,0.4)"
                      : "rgba(42,74,127,0.3)"}`,
                  }}
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {chain && (
            <div className="animate-fadeIn">
              {/* Degree count hero */}
              <div className="text-center mb-8 py-6 rounded-xl" style={{ background: "#111d33" }}>
                <div className="font-display text-6xl md:text-7xl font-bold text-school-accent mb-1">
                  {degrees}
                </div>
                <div className="font-mono text-sm" style={{ color: "#8ba4c7" }}>
                  degree{degrees !== 1 ? "s" : ""} of separation
                </div>
                <div className="font-body text-xs mt-2" style={{ color: "#6b83a5" }}>
                  {playerMap[playerA]?.name} → {playerMap[playerB]?.name}
                </div>
              </div>

              {/* Chain visualization */}
              <div className="rounded-xl p-5 md:p-8" style={{ background: "#0d1829", border: "1px solid rgba(42,74,127,0.3)" }}>
                <div className="font-mono text-xs uppercase tracking-wider mb-5" style={{ color: "#6b83a5" }}>
                  The Chain
                </div>
                {chain.map((id, i) => (
                  <ChainLink
                    key={id + i}
                    fromId={id}
                    toId={i < chain.length - 1 ? chain[i + 1] : null}
                    index={i}
                    isLast={i === chain.length - 1}
                  />
                ))}
              </div>

              {/* Explanation */}
              <p className="font-body text-xs text-center mt-6 italic" style={{ color: "#6b83a5" }}>
                Each link represents players who shared at least one season on the same Kentucky roster.
                The chain shows the shortest path of teammates connecting the two players.
              </p>
            </div>
          )}

          {/* Empty state */}
          {playerA && playerB && !chain && (
            <div className="text-center py-12" style={{ color: "#6b83a5" }}>
              <div className="font-display text-2xl text-school-accent mb-2">No Connection Found</div>
              <p className="font-body text-sm">
                These two players don&rsquo;t appear to be connected through shared rosters.
                This shouldn&rsquo;t happen in Through the Rafters &mdash; let us know if you think this is an error.
              </p>
            </div>
          )}

          {/* Idle state stats */}
          {!playerA && !playerB && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {[
                { label: "Players", value: allPlayers.length, sub: "in the graph" },
                { label: "Max Distance", value: "14", sub: "Taylor → Flagg" },
                { label: "Most Connected", value: "51", sub: "Spencer Hubbard" },
                { label: "Spanning", value: "47", sub: "years (1978–2026)" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg text-center py-3 px-2" style={{ background: "#111d33" }}>
                  <div className="font-mono text-xs uppercase tracking-wider" style={{ color: "#6b83a5" }}>{s.label}</div>
                  <div className="font-display text-school-accent text-2xl font-bold my-1">{s.value}</div>
                  <div className="font-mono text-xs" style={{ color: "#8ba4c7" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </Layout>
  );
}
