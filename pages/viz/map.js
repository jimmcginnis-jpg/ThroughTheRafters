// pages/viz/map.js
// Recruiting map with US state borders

import { useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import Layout from '../../components/Layout';
import playerData from '../../data/players.json';

// Minimal TopoJSON to GeoJSON converter
function topoToGeo(topology, objectName) {
  const obj = topology.objects[objectName];
  const arcs = topology.arcs;
  const tr = topology.transform;
  function decodeArc(idx) {
    const rev = idx < 0;
    const arc = arcs[rev ? ~idx : idx];
    let x = 0, y = 0;
    const c = arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * tr.scale[0] + tr.translate[0], y * tr.scale[1] + tr.translate[1]];
    });
    if (rev) c.reverse();
    return c;
  }
  function decodeRing(ring) {
    return ring.reduce((coords, idx) => coords.concat(decodeArc(idx)), []);
  }
  return {
    type: 'FeatureCollection',
    features: obj.geometries.map(geom => ({
      type: 'Feature',
      properties: geom.properties || {},
      geometry: {
        type: geom.type,
        coordinates: geom.type === 'Polygon'
          ? geom.arcs.map(decodeRing)
          : geom.arcs.map(poly => poly.map(decodeRing))
      }
    }))
  };
}

const COORDS = {"Charlotte, NC": [35.23, -80.84], "Fayetteville, NC": [35.05, -78.88], "Durham, NC": [35.99, -78.9], "Drewry, NC": [36.45, -78.33], "Mt. Airy, NC": [36.5, -80.61], "Burlington, NC": [36.1, -79.44], "Pinehurst, NC": [35.19, -79.47], "Kinston, NC": [35.26, -77.58], "Raleigh, NC": [35.78, -78.64], "High Point, NC": [35.96, -80.01], "Chapel Hill, NC": [35.91, -79.05], "Greensboro, NC": [36.07, -79.79], "Morrisville, NC": [35.82, -78.83], "Winston-Salem, NC": [36.1, -80.24], "North Mecklenburg, NC": [35.33, -80.85], "Falls Church, VA": [38.88, -77.17], "Sterling, VA": [39.01, -77.43], "Reston, VA": [38.97, -77.34], "Leesburg, VA": [39.12, -77.56], "Herndon, VA": [38.97, -77.39], "Manassas, VA": [38.75, -77.47], "Fredericksburg, VA": [38.3, -77.46], "Richmond, VA": [37.54, -77.44], "Fairfax, VA": [38.85, -77.31], "Shipman, VA": [37.73, -78.83], "Culpeper, VA": [38.47, -77.99], "Chesapeake, VA": [36.77, -76.29], "Roanoke, VA": [37.27, -79.94], "Virginia Beach, VA": [36.85, -75.98], "Arlington, VA": [38.88, -77.1], "Washington, DC": [38.91, -77.04], "Bowie, MD": [38.94, -76.73], "Bladensburg, MD": [38.94, -76.93], "Ft. Washington, MD": [38.73, -77.01], "Upper Marlboro, MD": [38.82, -76.75], "Baltimore, MD": [39.29, -76.61], "Beltsville, MD": [39.03, -76.91], "Clinton, MD": [38.76, -76.9], "Angola, NY": [42.64, -79.03], "White Plains, NY": [41.03, -73.77], "West Orange, NJ": [40.8, -74.24], "Clifton Park, NY": [42.84, -73.8], "Westtown, NY": [41.33, -74.54], "Jersey City, NJ": [40.73, -74.08], "Haddonfield, NJ": [39.89, -75.04], "Scotch Plains, NJ": [40.64, -74.39], "Red Bank, NJ": [40.35, -74.06], "Bloomfield, NJ": [40.81, -74.19], "Newark, NJ": [40.74, -74.17], "Somerset, NJ": [40.5, -74.49], "Plainfield, NJ": [40.63, -74.41], "Trenton, NJ": [40.22, -74.76], "Stewartsville, NJ": [40.69, -75.11], "Manhasset, NY": [40.8, -73.7], "Peekskill, NY": [41.29, -73.92], "Syracuse, NY": [43.05, -76.15], "Bronx, NY": [40.84, -73.87], "Allentown, PA": [40.6, -75.49], "Philadelphia, PA": [39.95, -75.17], "Lancaster, PA": [40.04, -76.31], "Blue Bell, PA": [40.15, -75.27], "Wayne, PA": [40.04, -75.39], "Norristown, PA": [40.12, -75.34], "Merion, PA": [40, -75.25], "Los Angeles, CA": [34.05, -118.24], "Pacific Palisades, CA": [34.04, -118.53], "Rolling Hills, CA": [33.76, -118.36], "Corona, CA": [33.88, -117.57], "Huntington Beach, CA": [33.66, -117.99], "Elk Grove, CA": [38.41, -121.37], "San Francisco, CA": [37.77, -122.42], "Oakland, CA": [37.8, -122.27], "Sherman Oaks, CA": [34.15, -118.45], "Kentfield, CA": [37.95, -122.56], "Scottsdale, AZ": [33.49, -111.93], "Phoenix, AZ": [33.45, -112.07], "El Paso, TX": [31.76, -106.49], "Lancaster, TX": [32.59, -96.76], "DeSoto, TX": [32.59, -96.86], "Houston, TX": [29.76, -95.37], "San Antonio, TX": [29.42, -98.49], "St. Louis, MO": [38.63, -90.2], "O'Fallon, MO": [38.81, -90.7], "Chicago, IL": [41.88, -87.63], "Chicago Heights, IL": [41.51, -87.64], "Park Forest, IL": [41.49, -87.67], "University Park, IL": [41.44, -87.68], "Westchester, IL": [41.85, -87.88], "Yorkville, IL": [41.64, -88.45], "Lake Forest, IL": [42.26, -87.84], "Northbrook, IL": [42.13, -87.83], "Joliet, IL": [41.53, -88.08], "Lincoln, IL": [40.15, -89.36], "Warsaw, IN": [41.24, -85.85], "New Castle, IN": [39.93, -85.37], "Carmel, IN": [39.98, -86.12], "Indianapolis, IN": [39.77, -86.16], "Golden Valley, MN": [44.99, -93.35], "Apple Valley, MN": [44.73, -93.22], "Rochester, MN": [44.02, -92.47], "Minneapolis, MN": [44.98, -93.27], "Shoreview, MN": [45.08, -93.15], "Livonia, MI": [42.37, -83.35], "Birmingham, MI": [42.55, -83.21], "Milwaukee, WI": [43.04, -87.91], "Shrewsbury, MA": [42.3, -71.71], "Weston, MA": [42.37, -71.3], "Boston, MA": [42.36, -71.06], "Belmont, MA": [42.4, -71.18], "Wakefield, RI": [41.44, -71.5], "Ridgefield, CT": [41.28, -73.5], "Mobile, AL": [30.69, -88.04], "Macon, GA": [32.84, -83.63], "Atlanta, GA": [33.75, -84.39], "Augusta, GA": [33.47, -81.97], "Roswell, GA": [34.02, -84.36], "Alpharetta, GA": [34.08, -84.29], "Gainesville, GA": [34.3, -83.82], "Buford, GA": [34.12, -83.99], "Norcross, GA": [33.94, -84.21], "Baton Rouge, LA": [30.45, -91.19], "Slidell, LA": [30.28, -89.78], "Jackson, MS": [32.3, -90.18], "Meridian, MS": [32.36, -88.7], "Memphis, TN": [35.15, -90.05], "Jacksonville, FL": [30.33, -81.66], "Winter Park, FL": [28.6, -81.34], "Southwest Ranches, FL": [26.06, -80.34], "Windermere, FL": [28.5, -81.53], "Miami, FL": [25.76, -80.19], "Tampa, FL": [27.95, -82.46], "Midwest City, OK": [35.45, -97.4], "Spartanburg, SC": [34.95, -81.93], "Hopkinsville, KY": [36.87, -87.49], "Lakewood, CO": [39.7, -105.08], "Denver, CO": [39.74, -104.99], "Colorado Springs, CO": [38.83, -104.82], "Mercer Island, WA": [47.57, -122.22], "Seattle, WA": [47.61, -122.33], "Alpine, UT": [40.45, -111.78], "Medford, OR": [42.33, -122.87], "Lake Oswego, OR": [45.42, -122.67], "Anchorage, AK": [61.22, -149.9], "Juneau, AK": [58.3, -134.42], "Las Vegas, NV": [36.17, -115.14], "Columbus, OH": [39.96, -82.99], "Whitehall, OH": [39.97, -82.89], "Franklin, OH": [39.56, -84.3], "Princeton, WV": [37.37, -81.1], "Newport, ME": [44.84, -69.27], "New Castle, DE": [39.66, -75.57], "Kansas City, KS": [39.11, -94.63], "Ottawa, KS": [38.62, -95.27], "St. Catharines, Ontario": [43.16, -79.24], "London, England": [51.51, -0.13], "Melbourne, Australia": [-37.81, 144.96], "Mississauga, Canada": [43.59, -79.64], "Kaduna, Nigeria": [10.52, 7.43], "Zagreb, Croatia": [45.81, 15.98], "Traralgon, Australia": [-38.2, 146.54], "Istanbul, Turkey": [41.01, 28.98], "Sydney, Australia": [-33.87, 151.21], "Benin City, Nigeria": [6.34, 5.63], "Rumbek, South Sudan": [6.81, 29.68], "Oderzo, Italy": [45.78, 12.49], "King, NC": [36.28, -80.36], "East Point, GA": [33.68, -84.44], "Escondido, CA": [33.12, -117.09], "Irvine, CA": [33.68, -117.83], "Kansas City, MO": [39.1, -94.58], "Longmeadow, MA": [42.05, -72.58], "Lovington, NM": [32.94, -103.35], "Sarasota, FL": [27.34, -82.53], "Shelburne, VT": [44.38, -73.23], "Waynesville, NC": [35.49, -83.01], "Woodside, CA": [37.43, -122.25], "Detroit, MI": [42.33, -83.05], "Gdynia, Poland": [54.52, 18.53], "Vilnius, Lithuania": [54.69, 25.28], "Harrisburg, NC": [35.32, -80.65], "Sun Prairie, WI": [43.18, -89.21], "Brooklyn Park, MN": [45.09, -93.36], "Fort Lauderdale, FL": [26.12, -80.14], "Norfolk, VA": [36.85, -76.29], "Severn, MD": [39.14, -76.69], "Southfield, MI": [42.47, -83.22], "Sugar Hill, GA": [34.11, -84.04]};

const eraColors = {foundation:'#8B4513',dynasty1:'#C5A258',transition:'#6B8E23',dynasty2:'#B22222',between:'#4169E1',resurgence:'#2E8B57',superteam:'#9932CC',scheyer:'#FF6347'};
const eraNames = {foundation:'Foundation',dynasty1:'First Dynasty',transition:'Transition',dynasty2:'Second Dynasty',between:'In Between',resurgence:'Resurgence',superteam:'Superteam',scheyer:'Scheyer Era'};

const W = 960, H = 620;

export default function RecruitingMap() {
  const [hovered, setHovered] = useState(null);
  const [filterEra, setFilterEra] = useState('all');
  const [statesGeo, setStatesGeo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then(r => r.json())
      .then(topo => { setStatesGeo(topoToGeo(topo, 'states')); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const proj = useMemo(() => d3.geoAlbersUsa().scale(1200).translate([W/2, H/2]), []);
  const path = useMemo(() => d3.geoPath().projection(proj), [proj]);

  const players = useMemo(() =>
    playerData.players
      .filter(p => p.hometown && COORDS[p.hometown])
      .map(p => { const [lat,lng] = COORDS[p.hometown]; const pt = proj([lng,lat]); return {...p, px: pt?pt[0]:null, py: pt?pt[1]:null}; })
      .filter(p => p.px !== null)
  , [proj]);

  const filtered = filterEra === 'all' ? players : players.filter(p => p.era === filterEra);

  const grouped = {};
  filtered.forEach(p => {
    if (!grouped[p.hometown]) grouped[p.hometown] = {...p, players: []};
    grouped[p.hometown].players.push(p);
  });
  const pins = Object.values(grouped);

  const allWithCoords = playerData.players.filter(p => p.hometown && COORDS[p.hometown]);
  const intlFiltered = (filterEra === 'all' ? allWithCoords : allWithCoords.filter(p => p.era === filterEra))
    .filter(p => { const [lat,lng] = COORDS[p.hometown]; return !proj([lng,lat]); });

  const stateCounts = {};
  filtered.forEach(p => { const parts = p.hometown.split(','); if (parts.length >= 2) { const st = parts[parts.length-1].trim(); if (st.length === 2) stateCounts[st] = (stateCounts[st]||0)+1; }});
  const topStates = Object.entries(stateCounts).sort((a,b) => b[1]-a[1]).slice(0,8);

  const durham = proj([-78.9, 35.99]);

  return (
    <Layout title="Recruiting Map" description="Where Duke gets its players — hometown map of all 200+ Brotherhood members." canonical="/viz/map/">
      <div className="bg-duke-slate py-12">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="font-mono text-xs text-duke-goldLight mb-6 tracking-wider">
            <a href="/" className="hover:text-duke-gold">Home</a><span className="mx-2">/</span>
            <a href="/viz/" className="hover:text-duke-gold">Viz</a><span className="mx-2">/</span>
            <span className="text-duke-gold">Recruiting Map</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">Where Duke Gets Its Players</h1>
          <p className="font-body text-duke-goldLight text-lg mb-6">{filtered.length} players mapped by hometown, 1981&ndash;2026</p>

          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setFilterEra('all')} className={`px-3 py-1 font-mono text-xs rounded-full transition-colors ${filterEra==='all'?'bg-duke-gold text-duke-navyDark':'bg-white/10 text-duke-goldLight hover:bg-white/20'}`}>All Eras</button>
            {Object.entries(eraNames).map(([k,v]) => (
              <button key={k} onClick={() => setFilterEra(k)} className={`px-3 py-1 font-mono text-xs rounded-full transition-colors ${filterEra===k?'text-white':'bg-white/10 text-duke-goldLight hover:bg-white/20'}`} style={filterEra===k?{background:eraColors[k]}:{}}>{v}</button>
            ))}
          </div>

          <div className="relative rounded-lg overflow-hidden" style={{background:'#0d1f3c'}}>
            {loading ? (
              <div className="flex items-center justify-center" style={{height:500}}>
                <span className="font-mono text-duke-goldLight text-sm animate-pulse">Loading map...</span>
              </div>
            ) : (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{maxHeight:'70vh'}}>
                {statesGeo && statesGeo.features.map((f,i) => (
                  <path key={i} d={path(f)} fill="#12284a" stroke="#1e3a5f" strokeWidth={0.5} />
                ))}
                {durham && (
                  <g>
                    <circle cx={durham[0]} cy={durham[1]} r={12} fill="#C5A258" opacity={0.15}>
                      <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={durham[0]} cy={durham[1]} r={5} fill="#C5A258" opacity={0.5} stroke="#C5A258" strokeWidth={1.5} />
                    <text x={durham[0]} y={durham[1]-10} textAnchor="middle" fill="#C5A258" style={{fontSize:9,fontFamily:'monospace',fontWeight:'bold'}}>DUKE</text>
                  </g>
                )}
                {pins.map(pin => {
                  const count = pin.players.length;
                  const r = Math.min(3+count*2, 12);
                  const isH = hovered === pin.hometown;
                  const gold = pin.players.some(p => p.status==='done');
                  return (
                    <g key={pin.hometown} onMouseEnter={() => setHovered(pin.hometown)} onMouseLeave={() => setHovered(null)} style={{cursor:'pointer'}}>
                      {isH && <circle cx={pin.px} cy={pin.py} r={r+6} fill="#C5A258" opacity={0.2} />}
                      <circle cx={pin.px} cy={pin.py} r={isH?r+2:r} fill={gold?'#C5A258':'#4a7ab5'} opacity={isH?1:0.8} stroke={isH?'white':'none'} strokeWidth={isH?1.5:0} />
                      {count > 1 && <text x={pin.px} y={pin.py+1} textAnchor="middle" dominantBaseline="middle" fill="#001A57" style={{fontSize:8,fontFamily:'monospace',fontWeight:'bold'}}>{count}</text>}
                    </g>
                  );
                })}
              </svg>
            )}

            {hovered && (() => {
              const pin = pins.find(p => p.hometown === hovered);
              if (!pin) return null;
              const xP = (pin.px/W)*100, yP = (pin.py/H)*100;
              const flipR = xP > 70, flipD = yP < 15;
              return (
                <div className="absolute pointer-events-none px-3 py-2 rounded-lg shadow-xl" style={{left:`${flipR?xP-2:xP+2}%`,top:`${flipD?yP+4:yP-2}%`,transform:`translate(${flipR?'-100%':'0'},${flipD?'0':'-100%'})`,background:'#1a2d4d',border:'1px solid #2a4a7f',zIndex:100}}>
                  <div className="font-mono text-xs text-duke-gold font-bold">{pin.hometown}</div>
                  {pin.players.map(p => <div key={p.name} className="font-body text-xs text-white/80">{p.name} <span className="text-white/40">({p.years})</span></div>)}
                </div>
              );
            })()}
          </div>

          {intlFiltered.length > 0 && (
            <div className="mt-6 rounded-lg p-4" style={{background:'#111d33',border:'1px solid #2a4a7f'}}>
              <h3 className="font-mono text-xs text-duke-gold uppercase tracking-wider mb-3">International ({intlFiltered.length})</h3>
              <div className="flex flex-wrap gap-3">
                {intlFiltered.map(p => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{background:eraColors[p.era]}} />
                    {p.status==='done' || p.status==='pledged' ? <a href={`/players/${p.slug}/`} className="font-body text-sm text-duke-gold hover:text-duke-goldLight">{p.name}</a> : <span className="font-body text-sm text-white/60">{p.name}</span>}
                    <span className="font-mono text-xs text-white/40">{p.hometown}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {topStates.map(([st,c]) => (
              <div key={st} className="rounded-lg text-center py-3" style={{background:'#111d33'}}>
                <div className="font-display text-duke-gold text-2xl font-bold">{c}</div>
                <div className="font-mono text-xs text-white/60">{st}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-duke-gold" /><span className="font-mono text-xs text-duke-goldLight">Profiled</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background:'#4a7ab5'}} /><span className="font-mono text-xs text-white/60">Roster</span></div>
            <div className="flex items-center gap-2"><svg width="16" height="16"><circle cx="8" cy="8" r="5" fill="#C5A258" opacity="0.5" stroke="#C5A258" strokeWidth="1.5" /></svg><span className="font-mono text-xs text-duke-gold">Durham</span></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
