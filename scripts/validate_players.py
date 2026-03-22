#!/usr/bin/env python3
"""
DukeBrotherhood Player JSON Validator
Run before every push: python3 scripts/validate_players.py
"""
import json, sys

with open('data/players.json') as f:
    data = json.load(f)

errors = []
warnings = []

for p in data['players']:
    pid = p.get('id', 'UNKNOWN')
    name = p.get('name', 'UNKNOWN')
    label = f"{name} ({pid})"

    # ── Required fields on ALL players ──
    for field in ['id','slug','era','name','pos','years','status','seasons','jersey','hometown']:
        if field not in p:
            errors.append(f"{label}: missing required field '{field}'")

    # ── Required fields on DONE players ──
    if p.get('status') == 'done':
        for field in ['tagline','now','stat','bio','sources','charity','lastUpdated']:
            if field not in p:
                errors.append(f"{label}: DONE profile missing '{field}'")
            elif field == 'tagline' and not p[field]:
                errors.append(f"{label}: DONE profile has empty tagline")
            elif field == 'bio' and not isinstance(p[field], dict):
                errors.append(f"{label}: bio must be a dict, got {type(p[field]).__name__}")
            elif field == 'bio' and not p[field].get('road') and not p[field].get('duke'):
                errors.append(f"{label}: bio dict has no 'road' or 'duke' section")
            elif field == 'sources' and not isinstance(p[field], list):
                errors.append(f"{label}: sources must be a list")
            elif field == 'sources' and len(p[field]) == 0:
                warnings.append(f"{label}: sources array is empty")
            elif field == 'charity' and not isinstance(p[field], dict):
                errors.append(f"{label}: charity must be a dict")

        # ── Sources must use 'title' not 'label' ──
        for src in p.get('sources', []):
            if 'label' in src and 'title' not in src:
                errors.append(f"{label}: source uses 'label' instead of 'title': {src.get('label','')[:40]}")

    # ── NBA field validation ──
    nba = p.get('nba')
    if isinstance(nba, dict):
        # careerYears must be string or None, NOT int
        cy = nba.get('careerYears')
        if cy is not None and not isinstance(cy, str):
            errors.append(f"{label}: nba.careerYears must be string (e.g. '2011-20'), got {type(cy).__name__}: {cy}")

        # teams must be list of dicts with 'team' key, NOT list of strings
        teams = nba.get('teams', [])
        if teams and isinstance(teams[0], str):
            errors.append(f"{label}: nba.teams must be objects [{{'team':'...','seasons':[...]}}], got strings")
        for t in teams:
            if isinstance(t, dict) and 'team' not in t:
                errors.append(f"{label}: nba.teams object missing 'team' key: {t}")

        # highlights must be list
        hl = nba.get('highlights')
        if hl is not None and not isinstance(hl, list):
            errors.append(f"{label}: nba.highlights must be a list")

        # games must be int or None
        games = nba.get('games')
        if games is not None and not isinstance(games, (int, float)):
            errors.append(f"{label}: nba.games must be numeric, got {type(games).__name__}")

        # ppg/rpg/apg must be numeric or None
        for stat in ['ppg','rpg','apg']:
            val = nba.get(stat)
            if val is not None and not isinstance(val, (int, float)):
                errors.append(f"{label}: nba.{stat} must be numeric, got {type(val).__name__}: {val}")

    # ── Seasons must be a list of strings ──
    seasons = p.get('seasons', [])
    if not isinstance(seasons, list):
        errors.append(f"{label}: seasons must be a list")
    for s in seasons:
        if not isinstance(s, str) or len(s) != 7:
            errors.append(f"{label}: invalid season format '{s}' (expected 'YYYY-YY')")

# ── Print results ──
if errors:
    print(f"\n❌ {len(errors)} ERROR(S) FOUND — fix before pushing:\n")
    for e in errors:
        print(f"  ✗ {e}")
    print()

if warnings:
    print(f"\n⚠️  {len(warnings)} WARNING(S):\n")
    for w in warnings:
        print(f"  ⚡ {w}")
    print()

if not errors and not warnings:
    done = len([p for p in data['players'] if p['status'] == 'done'])
    print(f"\n✅ All {len(data['players'])} players valid ({done} done profiles). Safe to push.\n")

sys.exit(1 if errors else 0)
