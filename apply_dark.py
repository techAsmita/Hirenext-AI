#!/usr/bin/env python3
"""Dark-mode restyle for HireNext (Dashboard.tsx, TopBar.tsx, AppLayout.tsx).
Run from the project root:  python3 apply_dark.py && npm run build
Each change applies independently; anything that does not match is SKIPPED (never aborts).
Backups go to .backups/dark-1/ (only created once)."""
import os, re, shutil, sys

DASH = 'src/pages/Dashboard.tsx'
TOP = 'src/components/layout/TopBar.tsx'
LAY = 'src/layouts/AppLayout.tsx'

for p in (DASH, TOP, LAY):
    if not os.path.exists(p):
        sys.exit('ERROR: %s not found. Run this from the hirenext project root.' % p)

os.makedirs('.backups/dark-1', exist_ok=True)
for p in (DASH, TOP, LAY):
    b = os.path.join('.backups/dark-1', os.path.basename(p))
    if not os.path.exists(b):
        shutil.copy(p, b)
print('backup: .backups/dark-1/')

files = {p: open(p, encoding='utf-8').read() for p in (DASH, TOP, LAY)}
applied, skipped = [], []

def S(p, old, new, n=1):
    return ('s', p, old, new, n)

def R(p, pattern, new):
    return ('r', p, pattern, new, 1)

def count(step):
    kind, p, a, b, n = step
    if kind == 's':
        return files[p].count(a)
    return len(re.findall(a, files[p], flags=re.S))

def run_group(label, steps):
    for st in steps:
        if count(st) != st[4]:
            skipped.append(label)
            print('SKIPPED  %-34s (no exact match for: %s)' % (label, st[2][:60].replace('\n', ' ')))
            return
    for kind, p, a, b, n in steps:
        if kind == 's':
            files[p] = files[p].replace(a, b)
        else:
            files[p] = re.sub(a, lambda m: b, files[p], flags=re.S)
    applied.append(label)
    print('applied  ', label)

# ---------------- Dashboard.tsx ----------------
run_group('cards + KPI tiles colour', [S(DASH,
    'dark:border-white/10 dark:bg-[#141a2e] dark:shadow-none',
    'dark:border-white/[0.08] dark:bg-[#16121f] dark:shadow-none', 2)])
run_group('page background', [S(DASH, 'dark:bg-none dark:bg-[#0b1120]', 'dark:bg-none dark:bg-[#0c0a13]')])
run_group('hero: remove white card in dark', [R(DASH, r'(?<!dark:bg-none )dark:bg-transparent">', 'dark:bg-none dark:bg-transparent">')])

WAVE = '''{/* Dark-mode: aurora ribbon behind the quote */}
            <svg aria-hidden="true" viewBox="0 0 1200 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full dark:block">
              <defs>
                <linearGradient id="hn-wave-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#d946ef" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="hn-wave-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff8a4c" stopOpacity="0" />
                  <stop offset="35%" stopColor="#ff7a45" />
                  <stop offset="65%" stopColor="#e879f9" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <ellipse cx="1000" cy="30" rx="170" ry="60" fill="#a855f7" opacity="0.14" />
              <path d="M480 160 C600 150 700 120 780 78 C850 42 930 18 1010 34 C1080 48 1130 70 1200 52 V160 Z" fill="url(#hn-wave-fill)" />
              <path d="M480 160 C600 150 700 120 780 78 C850 42 930 18 1010 34 C1080 48 1130 70 1200 52" fill="none" stroke="url(#hn-wave-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.9" />
            </svg>'''
run_group('hero: aurora ribbon', [R(DASH,
    r'\{/\* Dark-mode: flowing aurora waves \(matches reference exactly\) \*/\}\s*<svg.*?</svg>', WAVE)])

run_group('alert tile: red', [S(DASH, 'bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300',
    'bg-rose-100 text-rose-500 dark:bg-rose-500/30 dark:text-rose-200')])
run_group('alert tile: orange', [S(DASH, 'bg-orange-100 text-orange-500 dark:bg-orange-500/20 dark:text-orange-300',
    'bg-orange-100 text-orange-500 dark:bg-orange-500/30 dark:text-orange-200')])
run_group('alert tile: amber', [S(DASH, 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    'bg-amber-100 text-amber-600 dark:bg-amber-500/30 dark:text-amber-200')])
run_group('alert tile: blue', [S(DASH,
    "'No new cases', 0, 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'",
    "'No new cases', 0, 'bg-indigo-100 text-indigo-600 dark:bg-blue-500/30 dark:text-blue-200'")])
run_group('alert count badges', [R(DASH,
    r"w-5 text-center text-xs font-bold \$\{count\s*\?\s*'text-rose-500'\s*:\s*'text-slate-400'\}",
    "w-5 text-center text-xs font-bold dark:flex dark:h-6 dark:w-6 dark:items-center dark:justify-center dark:rounded-md ${count ? 'text-rose-500 dark:bg-rose-500/20 dark:text-rose-300' : 'text-slate-400 dark:bg-blue-500/20 dark:text-blue-300'}")])

BIGFIVE = '''const bigFive: [string, number, string, string][] = [
  ['Openness', 78, '#3b82f6', 'dark:bg-[linear-gradient(90deg,#3b82f6,#60a5fa)]'],
  ['Conscientiousness', 82, '#7c5cff', 'dark:bg-[linear-gradient(90deg,#ec4899,#fb7185)]'],
  ['Extraversion', 65, '#f43f5e', 'dark:bg-[linear-gradient(90deg,#fb7185,#fb923c)]'],
  ['Agreeableness', 70, '#f59e0b', 'dark:bg-[linear-gradient(90deg,#f59e0b,#fbbf24)]'],
  ['Neuroticism', 42, '#10b981', 'dark:bg-[linear-gradient(90deg,#10b981,#34d399)]'],
];'''
run_group('personality bars (all-or-nothing)', [
    R(DASH, r"const bigFive: \[string, number, string\]\[\] = \[.*?\n\];", BIGFIVE),
    S(DASH, '{bigFive.map(([name, v, c]) => (', '{bigFive.map(([name, v, c, dg]) => ('),
    S(DASH, 'h-2 flex-1 rounded-full bg-slate-100 dark:bg-white/10',
            'h-2 flex-1 rounded-full bg-slate-100 dark:h-2.5 dark:bg-white/10'),
    S(DASH, '<div className="h-2 rounded-full" style={{ width: `${v}%`, background: c }} />',
            '<div className={`h-2 rounded-full dark:h-2.5 ${dg}`} style={{ width: `${v}%`, backgroundColor: c }} />'),
])

run_group('behaviour icon tiles', [R(DASH,
    r'className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"\s*style=\{\{ background: color \}\}',
    'className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--tile)] text-white dark:bg-[color:var(--tile-d)] dark:text-[color:var(--tile)]" style={{ \'--tile\': color, \'--tile-d\': `${color}33` } as React.CSSProperties}')])

# ---------------- TopBar.tsx ----------------
run_group('top bar: no band', [S(TOP, 'dark:border-slate-800 dark:bg-slate-950/80',
    'dark:border-transparent dark:bg-[#0c0a13]/80')])
run_group('top bar: search box', [S(TOP,
    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900',
    'dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:ring-violet-500/30')])
run_group('top bar: date pill', [S(TOP, 'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
    'dark:border-white/10 dark:bg-white/5 dark:text-slate-200')])
run_group('top bar: toggle focus ring', [S(TOP, 'dark:hover:bg-slate-800" aria-label="Toggle theme"',
    'outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 dark:hover:bg-white/10" aria-label="Toggle theme"')])
run_group('top bar: avatar', [S(TOP, 'text-indigo-700">R', 'text-indigo-700 dark:bg-violet-500 dark:text-white">R')])

# ---------------- AppLayout.tsx ----------------
run_group('app shell background', [S(LAY, 'bg-[#eef4fc] dark:bg-[#0b1120]', 'bg-[#eef4fc] dark:bg-[#0c0a13]')])

for p, s in files.items():
    open(p, 'w', encoding='utf-8').write(s)
print('\n%d applied, %d skipped.' % (len(applied), len(skipped)))
if skipped:
    print('Skipped items did not match your file exactly - tell me which ones and I will adjust them.')
print('Next: npm run build   (undo: cp .backups/dark-1/Dashboard.tsx src/pages/ ; cp .backups/dark-1/TopBar.tsx src/components/layout/ ; cp .backups/dark-1/AppLayout.tsx src/layouts/)')
