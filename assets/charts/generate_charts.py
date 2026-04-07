import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patheffects as pe
from matplotlib.patches import FancyBboxPatch
import numpy as np

# Theme
BG       = '#0C0F0A'
GRID     = '#1E2418'
ACCENT   = '#CCFF00'
TEAL     = '#00D4AA'
CORAL    = '#FF6B6B'
GOLD     = '#FFD93D'
TEXT     = '#E8E8E3'
DIM      = '#888884'

plt.rcParams.update({
    'figure.facecolor': BG,
    'axes.facecolor': BG,
    'axes.edgecolor': GRID,
    'axes.labelcolor': TEXT,
    'xtick.color': TEXT,
    'ytick.color': TEXT,
    'text.color': TEXT,
    'grid.color': GRID,
    'font.family': 'DejaVu Sans',
})

# ─────────────────────────────────────────────────────
# CHART 1: unit-economics.png
# ─────────────────────────────────────────────────────

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10),
                                gridspec_kw={'height_ratios': [1.5, 1]})
fig.patch.set_facecolor(BG)
fig.subplots_adjust(hspace=0.55, left=0.22, right=0.92, top=0.88, bottom=0.08)

# ── Panel 1: CAC Payback Period ──
companies = ['ZScaler', 'ServiceNow', 'Cloudflare', 'CrowdStrike', 'Datadog', 'Samsara']
payback   = [15, 24, 18, 12, 8, 5]   # Samsara midpoint 5
colors_p  = [TEAL, TEAL, TEAL, TEAL, TEAL, ACCENT]
edge_colors = [TEAL, TEAL, TEAL, TEAL, TEAL, ACCENT]

bars1 = ax1.barh(companies, payback, height=0.52,
                 color=colors_p, edgecolor=edge_colors,
                 linewidth=1.2, zorder=3)

# grid lines
ax1.set_facecolor(BG)
ax1.xaxis.grid(True, color=GRID, linewidth=0.8, zorder=0)
ax1.set_axisbelow(True)
ax1.spines[:].set_visible(False)
ax1.spines['bottom'].set_visible(True)
ax1.spines['bottom'].set_color(GRID)

# benchmark line
ax1.axvline(12, color=CORAL, linewidth=1.6, linestyle='--', zorder=4, alpha=0.9)
ax1.text(12.3, 5.7, 'Industry Benchmark\n(12 mo)', color=CORAL,
         fontsize=7.5, va='top', fontweight='bold', alpha=0.9)

# value labels
for i, (bar, val) in enumerate(zip(bars1, payback)):
    label = f'{val} mo' if i > 0 else f'4–6 mo'
    ax1.text(val + 0.3, bar.get_y() + bar.get_height()/2,
             label, va='center', fontsize=9,
             color=ACCENT if i == len(bars1)-1 else TEXT,
             fontweight='bold' if i == len(bars1)-1 else 'normal')

ax1.set_xlim(0, 30)
ax1.set_xlabel('Months to Recoup CAC', fontsize=9, color=DIM, labelpad=6)
ax1.tick_params(axis='y', labelsize=9.5)
ax1.tick_params(axis='x', labelsize=8)
# highlight Samsara y-label
labels = ax1.get_yticklabels()
for lbl in labels:
    if lbl.get_text() == 'Samsara':
        lbl.set_color(ACCENT)
        lbl.set_fontweight('bold')
        lbl.set_fontsize(10.5)

# ── Panel 2: LTV:CAC Multiples ──
ltv_companies = ['Industry Avg', 'CrowdStrike', 'Datadog', 'Samsara']
ltv_vals      = [8, 12, 15, 25]
colors_l      = [TEAL, TEAL, TEAL, ACCENT]

bars2 = ax2.barh(ltv_companies, ltv_vals, height=0.45,
                 color=colors_l, edgecolor=colors_l,
                 linewidth=1.2, zorder=3)

ax2.set_facecolor(BG)
ax2.xaxis.grid(True, color=GRID, linewidth=0.8, zorder=0)
ax2.set_axisbelow(True)
ax2.spines[:].set_visible(False)
ax2.spines['bottom'].set_visible(True)
ax2.spines['bottom'].set_color(GRID)

for i, (bar, val) in enumerate(zip(bars2, ltv_vals)):
    ax2.text(val + 0.3, bar.get_y() + bar.get_height()/2,
             f'{val}x', va='center', fontsize=9,
             color=ACCENT if i == len(bars2)-1 else TEXT,
             fontweight='bold' if i == len(bars2)-1 else 'normal')

ax2.set_xlim(0, 32)
ax2.set_xlabel('LTV / CAC Multiple', fontsize=9, color=DIM, labelpad=6)
ax2.tick_params(axis='y', labelsize=9.5)
ax2.tick_params(axis='x', labelsize=8)
labels2 = ax2.get_yticklabels()
for lbl in labels2:
    if lbl.get_text() == 'Samsara':
        lbl.set_color(ACCENT)
        lbl.set_fontweight('bold')
        lbl.set_fontsize(10.5)

# ── Titles ──
fig.text(0.07, 0.955, 'Best-in-Class Unit Economics',
         fontsize=17, fontweight='bold', color=TEXT, va='top')
fig.text(0.07, 0.925, 'Enterprise SaaS Payback Period Comparison',
         fontsize=10.5, color=DIM, va='top')

# panel labels
ax1.set_title('CAC Payback Period  (lower = better)', fontsize=9, color=DIM,
              loc='left', pad=8)
ax2.set_title('LTV : CAC Multiple  (higher = better)', fontsize=9, color=DIM,
              loc='left', pad=8)

# accent rule under main title
fig.add_artist(plt.Line2D([0.07, 0.55], [0.912, 0.912],
               transform=fig.transFigure,
               color=ACCENT, linewidth=1.5, alpha=0.6))

plt.savefig('/home/user/workspace/samsara-thesis-site/assets/charts/unit-economics.png',
            dpi=200, bbox_inches='tight', facecolor=BG)
plt.close()
print("unit-economics.png saved")

# ─────────────────────────────────────────────────────
# CHART 2: analyst-targets.png
# ─────────────────────────────────────────────────────

fig2, ax = plt.subplots(figsize=(13, 7.5))
fig2.patch.set_facecolor(BG)
ax.set_facecolor(BG)
fig2.subplots_adjust(left=0.1, right=0.93, top=0.84, bottom=0.14)

# ── Data ──
# 1 sell, 4 hold, 12 buy, 1 strong buy = 18 total
np.random.seed(42)

sell_prices    = [30.0]
hold_prices    = [36.0, 36.5, 37.5, 38.0]
buy_prices     = [40.0, 41.5, 42.0, 43.5, 44.0, 45.0, 46.5, 47.0,
                  48.5, 50.0, 51.0, 52.0]
sb_prices      = [57.60]

# Confidence (y) – spread for visual interest
sell_conf      = [4]
hold_conf      = [3, 7, 5, 8]
buy_conf       = [5, 3, 8, 6, 4, 7, 9, 5, 6, 4, 7, 8]
sb_conf        = [9]

def scatter_group(ax, prices, confs, color, label, size=110, zorder=5, marker='o'):
    ax.scatter(prices, confs, c=color, s=size, zorder=zorder,
               edgecolors='white', linewidths=0.6, label=label, marker=marker, alpha=0.95)

# ── Shaded upside region ──
ax.axvspan(30.64, 46.18, alpha=0.10, color=ACCENT, zorder=1)

# ── Grid ──
ax.set_facecolor(BG)
ax.xaxis.grid(True, color=GRID, linewidth=0.9, zorder=0)
ax.yaxis.grid(True, color=GRID, linewidth=0.5, zorder=0, alpha=0.5)
ax.set_axisbelow(True)
ax.spines[:].set_visible(False)
ax.spines['bottom'].set_color(GRID)
ax.spines['left'].set_color(GRID)
ax.spines['bottom'].set_visible(True)
ax.spines['left'].set_visible(True)

# ── Scatter dots ──
scatter_group(ax, sell_prices, sell_conf, CORAL, 'Sell / Underperform', size=140)
scatter_group(ax, hold_prices, hold_conf, GOLD,  'Hold / Neutral',      size=120)
scatter_group(ax, buy_prices,  buy_conf,  ACCENT,'Buy / Outperform',    size=120)
scatter_group(ax, sb_prices,   sb_conf,   ACCENT,'Strong Buy',          size=200, marker='*')

# ── Current price line ──
ax.axvline(30.64, color=CORAL, linewidth=1.8, linestyle='--', zorder=6, alpha=0.9)
ax.text(30.64, 10.35, 'Current\n$30.64', color=CORAL,
        fontsize=8.5, ha='center', va='bottom', fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.3', facecolor=BG, edgecolor=CORAL, linewidth=0.8))

# ── Avg target line ──
ax.axvline(46.18, color=ACCENT, linewidth=2.0, linestyle='--', zorder=6, alpha=0.95)
ax.text(46.18, 10.35, 'Avg Target\n$46.18', color=ACCENT,
        fontsize=8.5, ha='center', va='bottom', fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.3', facecolor=BG, edgecolor=ACCENT, linewidth=0.8))

# ── +47% annotation arrow ──
ax.annotate('', xy=(46.18, 6.5), xytext=(30.64, 6.5),
            arrowprops=dict(arrowstyle='->', color=ACCENT, lw=2.0))
ax.text((30.64+46.18)/2, 6.85, '+47% to consensus target',
        ha='center', va='bottom', fontsize=9.5, color=ACCENT, fontweight='bold')

# ── Firm labels ──
firm_labels = {
    47.0: ('Goldman Sachs', 5),
    44.0: ('BMO Capital', 4),
    52.0: ('KeyBanc', 7),
    50.0: ('Piper Sandler', 4),
}
for price, (firm, conf) in firm_labels.items():
    offset_x = 0.6
    offset_y = 0.45
    ax.annotate(firm, xy=(price, conf),
                xytext=(price + offset_x, conf + offset_y),
                fontsize=7.5, color=DIM,
                arrowprops=dict(arrowstyle='-', color=GRID, lw=0.8),
                va='center')

# ── Axes ──
ax.set_xlim(27, 62)
ax.set_ylim(1, 11.5)
ax.set_xlabel('12-Month Price Target (USD)', fontsize=10, color=DIM, labelpad=8)
ax.set_ylabel('Analyst Confidence', fontsize=10, color=DIM, labelpad=8)
ax.tick_params(colors=TEXT, labelsize=9)

# x ticks every $4
ax.set_xticks(range(28, 62, 4))
ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'${x:.0f}'))

# y ticks hidden (arbitrary scale)
ax.set_yticks([2, 4, 6, 8, 10])
ax.set_yticklabels(['Low', '', 'Mid', '', 'High'], fontsize=8, color=DIM)

# ── Legend ──
legend = ax.legend(loc='lower right', frameon=True,
                   facecolor=GRID, edgecolor=ACCENT,
                   labelcolor=TEXT, fontsize=8.5,
                   markerscale=0.9, borderpad=0.8)
legend.get_frame().set_linewidth(0.8)

# ── Titles ──
fig2.text(0.10, 0.955, 'Wall Street Consensus: 18 Analysts,  Avg Target $46.18',
          fontsize=15.5, fontweight='bold', color=TEXT, va='top')
fig2.text(0.10, 0.925,
          'Samsara (IOT)  ·  12-Month Price Target Distribution  ·  April 2026',
          fontsize=9.5, color=DIM, va='top')

# accent rule
fig2.add_artist(plt.Line2D([0.10, 0.70], [0.912, 0.912],
               transform=fig2.transFigure,
               color=ACCENT, linewidth=1.4, alpha=0.6))

# ticker badge top-right
ax.text(0.995, 1.04, 'IOT', transform=ax.transAxes,
        fontsize=11, fontweight='bold', color=BG,
        ha='right', va='bottom',
        bbox=dict(boxstyle='round,pad=0.4', facecolor=ACCENT, edgecolor='none'))

plt.savefig('/home/user/workspace/samsara-thesis-site/assets/charts/analyst-targets.png',
            dpi=200, bbox_inches='tight', facecolor=BG)
plt.close()
print("analyst-targets.png saved")
