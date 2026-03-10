import { useState, useMemo, useCallback } from 'react';
import { Search, X, ChefHat, ShoppingCart, CheckCircle, ChevronRight } from 'lucide-react';
import { ingredientsDatabase } from '../data/ingredients';
import { pieCategories, PieCategory, PieRecipe } from '../types/pieTypes';

const CAT_CONFIG: Record<string, { emoji: string; label: string }> = {
  flour:     { emoji: '🌾', label: 'Flours' },
  sugar:     { emoji: '🍬', label: 'Sugars' },
  fat:       { emoji: '🧈', label: 'Fats' },
  liquid:    { emoji: '💧', label: 'Liquids' },
  egg:       { emoji: '🥚', label: 'Eggs' },
  leavening: { emoji: '⬆️', label: 'Leavening' },
  dairy:     { emoji: '🥛', label: 'Dairy' },
  flavoring: { emoji: '🌿', label: 'Flavorings' },
  chocolate: { emoji: '🍫', label: 'Chocolate' },
  fruit:     { emoji: '🍓', label: 'Fruits' },
  nuts:      { emoji: '🥜', label: 'Nuts & Seeds' },
  spice:     { emoji: '✨', label: 'Spices' },
  filling:   { emoji: '🍯', label: 'Fillings' },
  other:     { emoji: '➕', label: 'Other' },
};
const CAT_ORDER = Object.keys(CAT_CONFIG);

// ─── Pantry presets ───────────────────────────────────────────
const PANTRY_PRESETS = [
  {
    label: 'Basic Pie Pantry',
    emoji: '🥧',
    ingredients: [
      'All-Purpose Flour', 'Unsalted Butter', 'Granulated Sugar',
      'Whole Egg (large)', 'Salt', 'Ice Water', 'Vanilla Extract',
    ],
  },
  {
    label: 'Fruit Pie Ready',
    emoji: '🍎',
    ingredients: [
      'All-Purpose Flour', 'Unsalted Butter', 'Granulated Sugar',
      'Brown Sugar (Light)', 'Whole Egg (large)', 'Salt', 'Ice Water',
      'Cornstarch', 'Cinnamon', 'Lemon Juice',
    ],
  },
  {
    label: 'Custard Pie Ready',
    emoji: '🎃',
    ingredients: [
      'All-Purpose Flour', 'Unsalted Butter', 'Granulated Sugar',
      'Brown Sugar (Light)', 'Whole Egg (large)', 'Salt', 'Ice Water',
      'Pumpkin Puree', 'Evaporated Milk', 'Cinnamon', 'Nutmeg', 'Vanilla Extract',
    ],
  },
  {
    label: 'Cream Pie Ready',
    emoji: '🍫',
    ingredients: [
      'Graham Cracker Crumbs', 'Unsalted Butter', 'Granulated Sugar',
      'Whole Milk', 'Heavy Cream', 'Whole Egg (large)', 'Cornstarch',
      'Vanilla Extract', 'Salt',
    ],
  },
];

// ─── Substitutes ──────────────────────────────────────────────
const SUBSTITUTES: Record<string, string[]> = {
  'Unsalted Butter':           ['Salted Butter', 'Shortening', 'Vegan Butter'],
  'Salted Butter':             ['Unsalted Butter'],
  'Shortening':                ['Unsalted Butter', 'Vegan Butter'],
  'All-Purpose Flour':         ['Cake Flour', 'Bread Flour'],
  'Granulated Sugar':          ['Caster Sugar', 'Coconut Sugar'],
  'Brown Sugar (Light)':       ['Brown Sugar (Dark)', 'Granulated Sugar'],
  'Brown Sugar (Dark)':        ['Brown Sugar (Light)', 'Granulated Sugar'],
  'Powdered Sugar':            ['Granulated Sugar'],
  'Whole Egg (large)':         ['Egg Yolk', 'Egg White'],
  'Whole Milk':                ['2% Milk', 'Oat Milk', 'Soy Milk'],
  'Heavy Cream':               ['Whipping Cream', 'Half and Half'],
  'Evaporated Milk':           ['Whole Milk', 'Heavy Cream'],
  'Buttermilk':                ['Whole Milk', '2% Milk'],
  'Sweetened Condensed Milk':  ['Condensed Milk'],
  'Condensed Milk':            ['Sweetened Condensed Milk'],
  'Vanilla Extract':           ['Vanilla Bean Paste'],
  'Vanilla Bean Paste':        ['Vanilla Extract'],
  'Lemon Juice':               ['Lime Juice', 'Apple Cider Vinegar'],
  'Lime Juice':                ['Lemon Juice'],
  'Lemon Zest':                ['Lime Zest'],
  'Lime Zest':                 ['Lemon Zest'],
  'Cornstarch':                ['Tapioca Starch', 'All-Purpose Flour'],
  'Tapioca Starch':            ['Cornstarch'],
  'Corn Syrup':                ['Maple Syrup', 'Golden Syrup'],
  'Maple Syrup':               ['Corn Syrup', 'Honey'],
  'Pumpkin Puree':             ['Sweet Potato'],
  'Sweet Potato':              ['Pumpkin Puree'],
  'Graham Cracker Crumbs':     ['Digestive Biscuits', 'Vanilla Wafer Crumbs'],
  'Coconut Milk (canned)':     ['Heavy Cream'],
  'Cream Cheese':              ['Mascarpone'],
  'Cinnamon':                  ['Pumpkin Pie Spice'],
  'Pumpkin Pie Spice':         ['Cinnamon'],
  'Chicken Broth':             ['Vegetable Broth'],
  'Pecans':                    ['Walnuts'],
  'Walnuts':                   ['Pecans'],
};

const COMBO_SUBS: { needs: string[]; covers: string }[] = [
  { needs: ['Whole Milk', 'Lemon Juice'],         covers: 'Buttermilk' },
  { needs: ['Unsalted Butter', 'Salt'],           covers: 'Salted Butter' },
  { needs: ['Granulated Sugar', 'Whole Milk'],    covers: 'Sweetened Condensed Milk' },
  { needs: ['Brown Sugar (Light)', 'Molasses'],   covers: 'Brown Sugar (Dark)' },
  { needs: ['Graham Cracker Crumbs', 'Unsalted Butter'], covers: 'Graham Cracker Crust' },
];

// ─── Match types ──────────────────────────────────────────────
export interface PieRecipeMatch {
  category: PieCategory;
  pie: PieRecipe;
  missingCount: number;
  missingIngredients: string[];
  matchPercent: number;
}

function isCovered(name: string, pantrySet: Set<string>): boolean {
  if (pantrySet.has(name)) return true;
  return (SUBSTITUTES[name] ?? []).some(s => pantrySet.has(s));
}

export function findMatchingPies(pantryNames: string[]): PieRecipeMatch[] {
  const pantrySet = new Set(pantryNames);
  const comboCovers = new Set<string>();
  COMBO_SUBS.forEach(({ needs, covers }) => {
    if (needs.every(n => pantrySet.has(n))) comboCovers.add(covers);
  });

  const results: PieRecipeMatch[] = [];
  pieCategories.forEach(category => {
    category.pies.forEach(pie => {
      const missing: string[] = [];
      pie.ingredients.forEach(({ name }) => {
        if (!isCovered(name, pantrySet) && !comboCovers.has(name)) missing.push(name);
      });
      const total = pie.ingredients.length;
      const matchPercent = Math.round(((total - missing.length) / total) * 100);
      if (missing.length <= 2) {
        results.push({ category, pie, missingCount: missing.length, missingIngredients: missing, matchPercent });
      }
    });
  });

  results.sort((a, b) => {
    if (a.missingCount !== b.missingCount) return a.missingCount - b.missingCount;
    if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent;
    return a.pie.name.localeCompare(b.pie.name);
  });
  return results;
}

// ─── Props ────────────────────────────────────────────────────
interface PiePantryModalProps {
  onClose: () => void;
  onSelectPie: (category: PieCategory, pie: PieRecipe) => void;
}

// ─── Component ───────────────────────────────────────────────
export function PiePantryModal({ onClose, onSelectPie }: PiePantryModalProps) {
  const [screen, setScreen] = useState<'pantry' | 'results'>('pantry');
  const [pantry, setPantry] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [results, setResults] = useState<PieRecipeMatch[]>([]);

  const toggle = useCallback((name: string) => {
    setPantry(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);

  const applyPreset = useCallback((preset: typeof PANTRY_PRESETS[0]) => {
    setPantry(prev => {
      const next = new Set(prev);
      preset.ingredients.forEach(n => {
        const match = ingredientsDatabase.find(i => i.name.toLowerCase() === n.toLowerCase());
        if (match) next.add(match.name);
      });
      return next;
    });
  }, []);

  const filtered = useMemo(() =>
    ingredientsDatabase.filter(ing =>
      (activeCat === 'all' || ing.category === activeCat) &&
      (search === '' || ing.name.toLowerCase().includes(search.toLowerCase()))
    ), [search, activeCat]);

  const grouped = useMemo(() =>
    CAT_ORDER.reduce<Record<string, typeof filtered>>((acc, cat) => {
      const items = filtered.filter(i => i.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    }, {}), [filtered]);

  const pantryList = useMemo(() => [...pantry].sort(), [pantry]);

  const handleFind = () => {
    setResults(findMatchingPies([...pantry]));
    setScreen('results');
  };

  const canMakeNow = results.filter(r => r.missingCount === 0);
  const missingOne = results.filter(r => r.missingCount === 1);
  const missingTwo = results.filter(r => r.missingCount === 2);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            {screen === 'results' && (
              <button onClick={() => setScreen('pantry')} className="text-gray-400 hover:text-gray-600">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            )}
            <ChefHat className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {screen === 'pantry' ? "What's in your pantry?" : 'Pies you can make'}
              </h2>
              <p className="text-xs text-gray-400">
                {screen === 'pantry'
                  ? `${pantry.size} ingredient${pantry.size !== 1 ? 's' : ''} selected`
                  : `${results.length} pies found · ${canMakeNow.length} ready now`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        {/* ── SCREEN 1: PANTRY ── */}
        {screen === 'pantry' && (<>
          {/* Presets */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Quick-select a pantry</p>
            <div className="flex gap-2 flex-wrap">
              {PANTRY_PRESETS.map(p => (
                <button key={p.label} onClick={() => applyPreset(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-all">
                  {p.emoji} {p.label}
                </button>
              ))}
              {pantry.size > 0 && (
                <button onClick={() => setPantry(new Set())}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-amber-200 text-xs font-medium text-amber-600 hover:bg-amber-50">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
          </div>

          {/* Selected chips */}
          {pantry.size > 0 && (
            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Your pantry</p>
              <div className="flex flex-wrap gap-1.5" style={{ maxHeight: '80px', overflowY: 'auto' }}>
                {pantryList.map(name => (
                  <button key={name} onClick={() => toggle(name)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, #92400e, #d97706)' }}>
                    {name} <X className="w-3 h-3 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="px-5 pt-3 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search ingredients..." className="flex-1 bg-transparent text-sm outline-none text-gray-700" />
              {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-gray-400" /></button>}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 px-5 pt-2 pb-1 overflow-x-auto flex-shrink-0">
            <button onClick={() => setActiveCat('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeCat === 'all' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
            {CAT_ORDER.map(cat => {
              const count = ingredientsDatabase.filter(i => i.category === cat).length;
              if (!count) return null;
              return (
                <button key={cat} onClick={() => setActiveCat(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeCat === cat ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {CAT_CONFIG[cat]?.emoji} {CAT_CONFIG[cat]?.label.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Ingredient list */}
          <div className="flex-1 overflow-y-auto px-5 py-2">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="mb-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1 py-1.5 sticky top-0 bg-white">
                  {CAT_CONFIG[cat]?.emoji} {CAT_CONFIG[cat]?.label}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {(items as typeof filtered).map(ing => {
                    const checked = pantry.has(ing.name);
                    return (
                      <button key={ing.id} onClick={() => toggle(ing.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all border ${checked ? 'border-amber-300 bg-amber-50 text-amber-800 font-medium' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'}`}>
                        <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${checked ? 'bg-amber-600 border-amber-600' : 'border-gray-300'}`}>
                          {checked && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        <span className="truncate">{ing.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No ingredients found</div>}
          </div>

          {/* CTA */}
          <div className="p-5 border-t border-gray-200 flex-shrink-0">
            <button onClick={handleFind} disabled={pantry.size === 0}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: pantry.size > 0 ? 'linear-gradient(135deg, #92400e, #d97706)' : '#d1d5db' }}>
              🔍 Find Pies ({pantry.size} ingredient{pantry.size !== 1 ? 's' : ''} selected)
            </button>
          </div>
        </>)}

        {/* ── SCREEN 2: RESULTS ── */}
        {screen === 'results' && (<>
          <div className="flex-1 overflow-y-auto">
            {results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <span className="text-5xl mb-4">🛒</span>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No matches found</h3>
                <p className="text-sm text-gray-500 mb-4">Try adding more staples — flour, butter, eggs, and sugar cover most pies.</p>
                <button onClick={() => setScreen('pantry')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl">
                  ← Back to pantry
                </button>
              </div>
            )}
            {canMakeNow.length > 0 && (
              <PieResultSection title="✅ Can Make Right Now"
                subtitle={`${canMakeNow.length} pie${canMakeNow.length !== 1 ? 's' : ''} — no shopping needed`}
                color="green" results={canMakeNow}
                onSelect={(cat, pie) => { onSelectPie(cat, pie); onClose(); }} />
            )}
            {missingOne.length > 0 && (
              <PieResultSection title="🛒 Missing 1 Ingredient"
                subtitle={`${missingOne.length} pie${missingOne.length !== 1 ? 's' : ''} — one quick stop`}
                color="amber" results={missingOne}
                onSelect={(cat, pie) => { onSelectPie(cat, pie); onClose(); }} />
            )}
            {missingTwo.length > 0 && (
              <PieResultSection title="🛒 Missing 2 Ingredients"
                subtitle={`${missingTwo.length} pie${missingTwo.length !== 1 ? 's' : ''} — almost there`}
                color="blue" results={missingTwo}
                onSelect={(cat, pie) => { onSelectPie(cat, pie); onClose(); }} />
            )}
          </div>
          <div className="p-5 border-t border-gray-200 flex-shrink-0 flex items-center justify-between">
            <button onClick={() => setScreen('pantry')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
              <ChevronRight className="w-4 h-4 rotate-180" /> Edit pantry
            </button>
            <div className="text-xs text-gray-400">{pantry.size} ingredients · {results.length} pies</div>
          </div>
        </>)}
      </div>
    </div>
  );
}

// ─── Result section ───────────────────────────────────────────
function PieResultSection({ title, subtitle, color, results, onSelect }: {
  title: string; subtitle: string; color: 'green' | 'amber' | 'blue';
  results: PieRecipeMatch[];
  onSelect: (category: PieCategory, pie: PieRecipe) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const colorMap = {
    green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', title: 'text-green-800' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', title: 'text-amber-800' },
    blue:  { bg: 'bg-blue-50',  border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700',   title: 'text-blue-800'  },
  }[color];

  return (
    <div className={`mx-5 my-4 rounded-xl border ${colorMap.border} ${colorMap.bg} overflow-hidden`}>
      <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div>
          <div className={`text-sm font-bold ${colorMap.title}`}>{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {results.map((r, i) => (
            <button key={`${r.category.id}-${r.pie.id}-${i}`} onClick={() => onSelect(r.category, r.pie)}
              className="w-full text-left bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all p-3 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">{r.pie.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-amber-700">{r.pie.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <span>{r.category.emoji}</span><span>{r.category.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colorMap.badge}`}>{r.matchPercent}%</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-400" />
                </div>
              </div>
              {r.missingIngredients.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500">Need:</span>
                  {r.missingIngredients.map(m => (
                    <span key={m} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
              )}
              {r.missingIngredients.length === 0 && (
                <div className="mt-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">You have everything!</span>
                </div>
              )}
              <p className="mt-1.5 text-xs text-gray-400 italic line-clamp-1">{r.pie.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
