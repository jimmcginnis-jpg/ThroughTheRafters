import config from '../school.config';
// components/SearchOverlay.js
// Reusable search overlay — triggered from nav or anywhere
// Searches all 238 players by name, hometown, high school, position, era

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import data from '../data/players.json';

const eraNames = {
  foundation: 'Foundation',
  dynasty1: 'First Dynasty',
  transition: 'Transition',
  dynasty2: 'Second Dynasty',
  between: 'In Between',
  resurgence: 'Resurgence',
  superteam: 'Superteam',
  scheyer: 'Scheyer Era',
};

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();
  const results = q.length >= 2
    ? data.players.filter(p => {
        const searchable = [
          p.name,
          p.hometown || '',
          p.highSchool || '',
          p.pos || '',
          p.years || '',
          p.jersey || '',
          eraNames[p.era] || '',
          p.tagline || '',
          p.now || '',
        ].join(' ').toLowerCase();
        return searchable.includes(q);
      }).slice(0, 20)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Search panel */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-gray-200 px-4">
          <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search players by name, hometown, school, position..."
            className="w-full py-4 text-lg outline-none font-body text-school-dark placeholder-gray-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 ml-2 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {q.length < 2 && (
            <div className="px-4 py-8 text-center text-gray-400 font-body text-sm">
              Type at least 2 characters to search {data.players.length} players
            </div>
          )}

          {q.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-400 font-body text-sm">
              No players found for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.map(player => {
            const isDone = player.status === 'done';
            return isDone ? (
              <Link
                key={player.id}
                href={`/players/${player.slug}/`}
                onClick={onClose}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-school-primary flex items-center justify-center">
                  <span className="font-mono text-xs text-school-accent font-bold">
                    {player.jersey || '#'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-school-primary font-semibold truncate">{player.name}</span>
                    <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-school-accent/10 text-school-accent">
                      Profile
                    </span>
                  </div>
                  <div className="font-mono text-xs text-gray-400 truncate">
                    {player.pos} &bull; {player.height} &bull; {player.years} &bull; {eraNames[player.era]}
                    {player.hometown ? ` \u2022 ${player.hometown}` : ''}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ) : (
              <div
                key={player.id}
                className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 opacity-60"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-mono text-xs text-gray-500 font-bold">
                    {player.jersey || '#'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-gray-600 truncate">{player.name}</span>
                    <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      Roster
                    </span>
                  </div>
                  <div className="font-mono text-xs text-gray-400 truncate">
                    {player.pos} &bull; {player.height} &bull; {player.years} &bull; {eraNames[player.era]}
                    {player.hometown ? ` \u2022 ${player.hometown}` : ''}
                  </div>
                </div>
              </div>
            );
          })}

          {results.length === 20 && (
            <div className="px-4 py-3 text-center text-gray-400 font-mono text-xs">
              Showing first 20 results &mdash; narrow your search
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 flex justify-between items-center">
          <span className="font-mono text-xs text-gray-400">
            {q.length >= 2 ? `${results.length} result${results.length !== 1 ? 's' : ''}` : `${data.players.length} players`}
          </span>
          <span className="font-mono text-xs text-gray-400">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}
