import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Plus, Trash2, ArrowLeft, Search, X, Printer } from 'lucide-react';

import { Ingredient, RecipeIngredient, MeasurementMode } from './types/cake';
import { PieCategory, PieRecipe, pieCategories } from './types/pieTypes';
import { CrustType, CrustRecipe, crustTypes } from './types/crustTypes';
import { ingredientsDatabase } from './data/ingredients';
import { calculateCakeMetrics } from './utils/cakeCalculations';
import { PieTypeSelector } from './components/PieTypeSelector';
import { MetricsDisplay } from './components/MetricsDisplay';
import { NutritionFacts } from './components/NutritionFacts';
import { PieBakingInstructions } from './components/PieBakingInstructions';

// ─── Unit helpers (same as CakeSensei) ───────────────────────
const DENSITY: Record<string, number> = {
  flour: 0.507, sugar: 0.845, fat: 0.960, liquid: 1.000,
  egg: 1.030, leavening: 0.934, dairy: 1.030, chocolate: 0.640, default: 0.845,
};
const EGG_SIZES: Record<string, { label: string; grams: number }> = {
  small: { label: 'Small', grams: 38 }, medium: { label: 'Medium', grams: 44 },
  large: { label: 'Large', grams: 50 }, xlarge: { label: 'Extra Large', grams: 56 },
};
type MetricUnit = 'mg' | 'g' | 'kg';
const METRIC_UNITS = [
  { value: 'mg' as MetricUnit, label: 'mg', toGrams: 0.001 },
  { value: 'g' as MetricUnit, label: 'g', toGrams: 1 },
  { value: 'kg' as MetricUnit, label: 'kg', toGrams: 1000 },
];
type ImperialUnit = 'oz' | 'lb';
const IMPERIAL_UNITS = [
  { value: 'oz' as ImperialUnit, label: 'oz', toGrams: 28.3495 },
  { value: 'lb' as ImperialUnit, label: 'lb', toGrams: 453.592 },
];
type VolUnit = 'tsp' | 'tbsp' | 'floz' | 'cups' | 'pints' | 'quarts';
const VOL_UNITS = [
  { value: 'tsp' as VolUnit, label: 'tsp', toCups: 1/48 },
  { value: 'tbsp' as VolUnit, label: 'tbsp', toCups: 1/16 },
  { value: 'floz' as VolUnit, label: 'fl oz', toCups: 1/8 },
  { value: 'cups' as VolUnit, label: 'cups', toCups: 1 },
  { value: 'pints' as VolUnit, label: 'pints', toCups: 2 },
  { value: 'quarts' as VolUnit, label: 'quarts', toCups: 4 },
];
function bestMetricUnit(g: number): MetricUnit { return g < 1 ? 'mg' : g >= 1000 ? 'kg' : 'g'; }
function bestImperialUnit(g: number): ImperialUnit { return g >= 450 ? 'lb' : 'oz'; }
function bestVolUnit(g: number, cat: string): VolUnit {
  const d = DENSITY[cat] ?? DENSITY.default; const cups = g / (d * 236.588);
  if (['flour','sugar','leavening','spice'].includes(cat)) {
    return cups >= 0.25 ? 'cups' : cups * 16 >= 1 ? 'tbsp' : 'tsp';
  }
  return cups >= 4 ? 'quarts' : cups >= 0.25 ? 'cups' : cups * 8 >= 1 ? 'floz' : cups * 16 >= 1 ? 'tbsp' : 'tsp';
}
const FRACS = [{v:0,s:''},{v:1/8,s:'⅛'},{v:1/4,s:'¼'},{v:1/3,s:'⅓'},{v:3/8,s:'⅜'},
  {v:1/2,s:'½'},{v:5/8,s:'⅝'},{v:2/3,s:'⅔'},{v:3/4,s:'¾'},{v:7/8,s:'⅞'},{v:1,s:''}];
function snapFrac(x: number) {
  let b=FRACS[0],bd=Math.abs(x-0);
  for(const f of FRACS){const d=Math.abs(x-f.v);if(d<bd){bd=d;b=f;}}
  return b.v===1?{whole:1,fracStr:''}:{whole:0,fracStr:b.s};
}
function formatCups(cups: number): string {
  if(cups<=0)return'0 tsp';
  if(cups>=0.25){const w=Math.floor(cups);const{whole:fw,fracStr}=snapFrac(cups-w);const t=w+fw;
    const cs=t>0?`${t}${fracStr} cup${t>1?'s':''}`:fracStr?`${fracStr} cup`:'';
    if(!fracStr&&cups-w>0.01){const tbr=(cups-w)*16;const wt=Math.floor(tbr);
      const{whole:ttw,fracStr:tf}=snapFrac(tbr-wt);const tt=wt+ttw;
      const ts=tt>0?`${tt}${tf} tbsp`:tf?`${tf} tbsp`:'';
      return cs&&ts?`${cs} + ${ts}`:cs||ts||'0 tsp';}
    return cs||'0 tsp';}
  const tbsp=cups*16;
  if(tbsp>=1){const w=Math.floor(tbsp);const{whole:fw,fracStr}=snapFrac(tbsp-w);const t=w+fw;return t>0?`${t}${fracStr} tbsp`:fracStr?`${fracStr} tbsp`:'0 tsp';}
  const tsp=cups*48;const w=Math.floor(tsp);const{whole:fw,fracStr}=snapFrac(tsp-w);const t=w+fw;
  return t>0?`${t}${fracStr} tsp`:fracStr?`${fracStr} tsp`:'¼ tsp';
}
function gramsTo(g: number, mode: MeasurementMode, cat: string): string {
  if(mode==='metric')return g>=1000?`${(g/1000).toFixed(2)} kg`:g<1?`${(g*1000).toFixed(0)} mg`:`${g.toFixed(0)} g`;
  if(mode==='imperial')return g>=450?`${(g/453.592).toFixed(2)} lb`:`${(g/28.3495).toFixed(2)} oz`;
  const d=DENSITY[cat]??DENSITY.default;const cups=g/(d*236.588);
  return['flour','sugar','leavening','spice'].includes(cat)?formatCups(cups):cups>=4?`${(cups/4).toFixed(1)} qt`:formatCups(cups);
}

const CAT_CONFIG: Record<string, { emoji: string; label: string }> = {
  flour:{emoji:'🌾',label:'Flours'},sugar:{emoji:'🍬',label:'Sugars'},fat:{emoji:'🧈',label:'Fats'},
  liquid:{emoji:'💧',label:'Liquids'},egg:{emoji:'🥚',label:'Eggs'},leavening:{emoji:'⬆️',label:'Leavening'},
  dairy:{emoji:'🥛',label:'Dairy'},flavoring:{emoji:'🌿',label:'Flavorings'},chocolate:{emoji:'🍫',label:'Chocolate'},
  fruit:{emoji:'🍓',label:'Fruits'},nuts:{emoji:'🥜',label:'Nuts & Seeds'},spice:{emoji:'✨',label:'Spices'},
  filling:{emoji:'🍯',label:'Fillings'},other:{emoji:'➕',label:'Other'},
};
const CAT_ORDER = Object.keys(CAT_CONFIG);

// ─── Ingredient Dropdown ──────────────────────────────────────
function IngredientDropdown({current,onSelect,onClose}:{current:RecipeIngredient;onSelect:(i:Ingredient)=>void;onClose:()=>void}) {
  const [search,setSearch]=useState('');const [activeCat,setActiveCat]=useState('all');
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))onClose();};
    document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[onClose]);
  const filtered=ingredientsDatabase.filter(i=>(activeCat==='all'||i.category===activeCat)&&i.name.toLowerCase().includes(search.toLowerCase()));
  const grouped=CAT_ORDER.reduce<Record<string,Ingredient[]>>((a,cat)=>{const items=filtered.filter(i=>i.category===cat);if(items.length)a[cat]=items;return a},{});
  const usedCats=Array.from(new Set(ingredientsDatabase.map(i=>i.category)));
  return(
    <div ref={ref} className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl w-80" style={{maxHeight:'380px',display:'flex',flexDirection:'column'}}>
      <div className="p-2 border-b border-gray-100"><div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
        <Search className="w-3.5 h-3.5 text-gray-400"/>
        <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ingredients..." className="flex-1 bg-transparent text-sm outline-none text-gray-700"/>
        {search&&<button onClick={()=>setSearch('')}><X className="w-3 h-3 text-gray-400"/></button>}
      </div></div>
      <div className="flex gap-1 p-2 border-b border-gray-100 overflow-x-auto" style={{flexShrink:0}}>
        <button onClick={()=>setActiveCat('all')} className={`px-2 py-1 rounded text-xs whitespace-nowrap font-medium ${activeCat==='all'?'bg-amber-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
        {usedCats.map(cat=><button key={cat} onClick={()=>setActiveCat(cat)} className={`px-2 py-1 rounded text-xs whitespace-nowrap font-medium ${activeCat===cat?'bg-amber-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{CAT_CONFIG[cat]?.emoji} {CAT_CONFIG[cat]?.label.split(' ')[0]??cat}</button>)}
      </div>
      <div className="overflow-y-auto flex-1">
        {Object.entries(grouped).map(([cat,items])=>(
          <div key={cat}><div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wide bg-gray-50 sticky top-0">{CAT_CONFIG[cat]?.emoji} {CAT_CONFIG[cat]?.label??cat}</div>
          {items.map(ing=><button key={ing.id} onClick={()=>{onSelect(ing);onClose();}} className={`w-full text-left px-3 py-2 hover:bg-amber-50 flex justify-between items-center text-sm transition-colors ${ing.id===current.id?'bg-amber-50 font-semibold':''}`}><span className="text-gray-800">{ing.name}</span><span className="text-gray-400 text-xs">{ing.calories} kcal</span></button>)}
          </div>))}
        {filtered.length===0&&<div className="px-3 py-6 text-center text-sm text-gray-400">No ingredients found</div>}
      </div>
    </div>
  );
}

const unitSelectCls="text-xs border border-gray-200 rounded-lg px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-600 bg-white cursor-pointer";
const numInputCls="w-16 text-right text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-300";

// ─── Ingredient Row ───────────────────────────────────────────
function IngredientRow({ing,mode,onAmountChange,onSwap,onRemove}:{ing:RecipeIngredient;mode:MeasurementMode;onAmountChange:(id:string,g:number)=>void;onSwap:(id:string,ni:Ingredient)=>void;onRemove:(id:string)=>void}) {
  const [open,setOpen]=useState(false);
  const [metricUnit,setMetricUnit]=useState<MetricUnit>(()=>bestMetricUnit(ing.amount));
  const [imperialUnit,setImperialUnit]=useState<ImperialUnit>(()=>bestImperialUnit(ing.amount));
  const [volUnit,setVolUnit]=useState<VolUnit>(()=>bestVolUnit(ing.amount,ing.category));
  const [eggSize,setEggSize]=useState('large');
  const cfg=CAT_CONFIG[ing.category]??{emoji:'•',label:ing.category};
  const isEgg=ing.category==='egg';
  useEffect(()=>{setMetricUnit(bestMetricUnit(ing.amount));},[ing.id,ing.amount]);
  useEffect(()=>{setImperialUnit(bestImperialUnit(ing.amount));},[ing.id,ing.amount]);
  useEffect(()=>{setVolUnit(bestVolUnit(ing.amount,ing.category));},[ing.id,ing.amount,ing.category]);
  const eggCount=Math.max(1,Math.round(ing.amount/EGG_SIZES[eggSize].grams));
  const mDef=METRIC_UNITS.find(u=>u.value===metricUnit)!;
  const mValue=parseFloat((ing.amount/mDef.toGrams).toFixed(metricUnit==='mg'?0:metricUnit==='kg'?4:2));
  const iDef=IMPERIAL_UNITS.find(u=>u.value===imperialUnit)!;
  const iValue=parseFloat((ing.amount/iDef.toGrams).toFixed(imperialUnit==='lb'?4:2));
  const VUG=(u:VolUnit,cat:string)=>{const d=DENSITY[cat]??DENSITY.default;return(VOL_UNITS.find(v=>v.value===u)!.toCups)*d*236.588;};
  const FRAC_VALS=[{val:1/8,str:'⅛'},{val:1/4,str:'¼'},{val:1/3,str:'⅓'},{val:3/8,str:'⅜'},{val:1/2,str:'½'},{val:5/8,str:'⅝'},{val:2/3,str:'⅔'},{val:3/4,str:'¾'},{val:7/8,str:'⅞'}];
  const SEC:{[K in VolUnit]?:VolUnit}={quarts:'cups',cups:'tbsp',tbsp:'tsp'};
  const vd=(()=>{
    const pg=VUG(volUnit,ing.category);const su=SEC[volUnit]??null;const sg=su?VUG(su,ing.category):null;
    const exact=ing.amount/pg;const w=Math.floor(exact);const fp=exact-w;
    let bf={val:0,str:''};let bd=fp;for(const f of FRAC_VALS){const d=Math.abs(fp-f.val);if(d<bd){bd=d;bf=f;}}
    if(fp>0.94)return{pw:w+1,pf:'',pg,sv:0,su,showSec:false};
    if(bd<0.06){const c=bf.val>=1?1:0;const fs=bf.val>=1?'':bf.str;return{pw:w+c,pf:fs,pg,sv:0,su,showSec:false};}
    const rem=ing.amount-w*pg;const sv=sg?Math.round((rem/sg)*4)/4:0;
    return{pw:w,pf:'',pg,sv,su,showSec:sg!==null&&sv>0};
  })();
  const hpv=(val:number)=>{const sg=vd.showSec&&vd.su?vd.sv*VUG(vd.su,ing.category):0;const fg=vd.pf?(FRAC_VALS.find(f=>f.str===vd.pf)?.val??0)*vd.pg:0;onAmountChange(ing.recipeId,Math.max(0,val)*vd.pg+fg+sg);};
  return(
    <div className="py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 relative">
        <div className="relative flex-1 min-w-0">
          <button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-1 text-left w-full group">
            <span className="text-base">{cfg.emoji}</span>
            <span className="text-sm font-medium text-gray-800 truncate group-hover:text-amber-600 transition-colors">{ing.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${open?'rotate-180':''}`}/>
          </button>
          {open&&<IngredientDropdown current={ing} onSelect={ni=>onSwap(ing.recipeId,ni)} onClose={()=>setOpen(false)}/>}
        </div>
        {isEgg?(
          <div className="flex items-center gap-1">
            <input type="number" value={eggCount} min={1} step={1} onChange={e=>onAmountChange(ing.recipeId,Math.max(1,parseInt(e.target.value)||1)*EGG_SIZES[eggSize].grams)} className={numInputCls}/>
            <select value={eggSize} onChange={e=>{setEggSize(e.target.value);onAmountChange(ing.recipeId,eggCount*EGG_SIZES[e.target.value].grams);}} className={unitSelectCls}>
              {Object.entries(EGG_SIZES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        ):mode==='metric'?(
          <div className="flex items-center gap-1">
            <input type="number" value={mValue} min={0} step={metricUnit==='kg'?0.001:1} onChange={e=>onAmountChange(ing.recipeId,(parseFloat(e.target.value)||0)*mDef.toGrams)} className={numInputCls}/>
            <select value={metricUnit} onChange={e=>setMetricUnit(e.target.value as MetricUnit)} className={unitSelectCls}>
              {METRIC_UNITS.map(u=><option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        ):mode==='imperial'?(
          <div className="flex items-center gap-1">
            <input type="number" value={iValue} min={0} step={imperialUnit==='lb'?0.01:0.1} onChange={e=>onAmountChange(ing.recipeId,(parseFloat(e.target.value)||0)*iDef.toGrams)} className={numInputCls}/>
            <select value={imperialUnit} onChange={e=>setImperialUnit(e.target.value as ImperialUnit)} className={unitSelectCls}>
              {IMPERIAL_UNITS.map(u=><option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        ):(
          <div className="flex items-center gap-1 flex-wrap">
            <input type="number" value={vd.pw} min={0} step={1} onChange={e=>hpv(parseFloat(e.target.value)||0)} className={numInputCls}/>
            {vd.pf&&<span className="text-sm font-bold text-gray-700">{vd.pf}</span>}
            <select value={volUnit} onChange={e=>setVolUnit(e.target.value as VolUnit)} className={unitSelectCls}>
              {VOL_UNITS.filter(u=>u.value!=='floz').map(u=><option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        )}
        <button onClick={()=>onRemove(ing.recipeId)} className="text-gray-300 hover:text-amber-500 transition-colors ml-1"><Trash2 className="w-4 h-4"/></button>
      </div>
    </div>
  );
}

// ─── Add Ingredient Modal ─────────────────────────────────────
function AddModal({existing,onAdd,onClose}:{existing:RecipeIngredient[];onAdd:(i:Ingredient)=>void;onClose:()=>void}) {
  const [search,setSearch]=useState('');const [activeCat,setActiveCat]=useState('all');
  const existingIds=new Set(existing.map(e=>e.id));
  const filtered=ingredientsDatabase.filter(i=>!existingIds.has(i.id)&&(activeCat==='all'||i.category===activeCat)&&i.name.toLowerCase().includes(search.toLowerCase()));
  return(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200"><h3 className="text-lg font-bold text-gray-900">Add Ingredient</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button></div>
        <div className="p-3 border-b border-gray-100"><div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2"><Search className="w-4 h-4 text-gray-400"/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search all ingredients..." className="flex-1 bg-transparent text-sm outline-none"/></div></div>
        <div className="flex gap-1 p-3 border-b border-gray-100 overflow-x-auto flex-shrink-0">
          <button onClick={()=>setActiveCat('all')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeCat==='all'?'bg-amber-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All ({ingredientsDatabase.filter(i=>!existingIds.has(i.id)).length})</button>
          {CAT_ORDER.map(cat=>{const count=ingredientsDatabase.filter(i=>i.category===cat&&!existingIds.has(i.id)).length;if(!count)return null;return<button key={cat} onClick={()=>setActiveCat(cat)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeCat===cat?'bg-amber-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{CAT_CONFIG[cat]?.emoji} {CAT_CONFIG[cat]?.label.split(' ')[0]} ({count})</button>;})}
        </div>
        <div className="overflow-y-auto flex-1 p-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map(ing=><button key={ing.id} onClick={()=>onAdd(ing)} className="text-left p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all"><div className="flex items-center gap-2 mb-1"><span>{CAT_CONFIG[ing.category]?.emoji}</span><span className="text-sm font-medium text-gray-800">{ing.name}</span></div><div className="text-xs text-gray-400">{ing.calories} kcal · {ing.fat.toFixed(1)}g fat · {ing.sugar.toFixed(1)}g sugar</div></button>)}
          {filtered.length===0&&<div className="text-center py-12 text-gray-400">No ingredients found</div>}
        </div></div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<PieCategory | null>(null);
  const [selectedPie, setSelectedPie] = useState<PieRecipe | null>(null);
  const [recipe, setRecipe] = useState<RecipeIngredient[]>([]);
  const [mode, setMode] = useState<MeasurementMode>('metric');
  const [servings, setServings] = useState(8);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'nutrition' | 'baking'>('metrics');
  const [crustRecipe, setCrustRecipe] = useState<RecipeIngredient[]>([]);
  const [selectedCrustType, setSelectedCrustType] = useState<CrustType | null>(null);
  const [selectedCrustName, setSelectedCrustName] = useState<string | null>(null);
  const [showAddCrust, setShowAddCrust] = useState(false);
  const [crustExpanded, setCrustExpanded] = useState(true);

  const makeRecipe = (ingredients: { name: string; amount: number }[], prefix = '') =>
    ingredients.map(f => {
      const ing = ingredientsDatabase.find(i => i.name === f.name);
      if (!ing) return null;
      return { ...ing, recipeId: `${prefix}${ing.id}-${Date.now()}-${Math.random()}`, amount: f.amount };
    }).filter(Boolean) as RecipeIngredient[];

  const handleSelectPie = (category: PieCategory, pie: PieRecipe) => {
    setSelectedCategory(category);
    setSelectedPie(pie);
    setRecipe(makeRecipe(pie.ingredients));
    setCrustRecipe([]);
    setSelectedCrustType(null);
    setSelectedCrustName(null);
    setActiveTab('metrics');
  };

  // Change pie within same category
  const handleChangePie = (pieId: string) => {
    if (!selectedCategory) return;
    const pie = selectedCategory.pies.find(p => p.id === pieId);
    if (pie) handleSelectPie(selectedCategory, pie);
  };

  const updateAmount = useCallback((id: string, g: number) => setRecipe(p => p.map(r => r.recipeId === id ? { ...r, amount: g } : r)), []);
  const swapIngredient = useCallback((id: string, ni: Ingredient) => setRecipe(p => p.map(r => r.recipeId === id ? { ...ni, recipeId: id, amount: r.amount } : r)), []);
  const removeIngredient = useCallback((id: string) => setRecipe(p => p.filter(r => r.recipeId !== id)), []);
  const addIngredient = (ing: Ingredient) => setRecipe(p => [...p, { ...ing, recipeId: `${ing.id}-${Date.now()}`, amount: ing.defaultAmount }]);

  const selectCrustType = useCallback((type: CrustType) => { setSelectedCrustType(type); setSelectedCrustName(null); setCrustRecipe(makeRecipe(type.baseFormula, 'crust-')); }, []);
  const selectCrust = useCallback((type: CrustType, preset: CrustRecipe) => { setSelectedCrustType(type); setSelectedCrustName(preset.name); setCrustRecipe(makeRecipe(preset.ingredients, 'crust-')); }, []);
  const updateCrustAmount = useCallback((id: string, g: number) => setCrustRecipe(p => p.map(r => r.recipeId === id ? { ...r, amount: g } : r)), []);
  const swapCrustIngredient = useCallback((id: string, ni: Ingredient) => setCrustRecipe(p => p.map(r => r.recipeId === id ? { ...ni, recipeId: id, amount: r.amount } : r)), []);
  const removeCrustIngredient = useCallback((id: string) => setCrustRecipe(p => p.filter(r => r.recipeId !== id)), []);
  const addCrustIngredient = (ing: Ingredient) => setCrustRecipe(p => [...p, { ...ing, recipeId: `crust-${ing.id}-${Date.now()}`, amount: ing.defaultAmount }]);

  if (!selectedCategory || !selectedPie) {
    return <PieTypeSelector categories={pieCategories} onSelectCategory={handleSelectPie} />;
  }

  const handlePrint = () => {
    const fillingLines = recipe.map(ing => {
      const amt = gramsTo(ing.amount, mode === 'volumetric' ? 'metric' : mode, ing.category);
      return `  • ${ing.name}: ${amt}`;
    }).join('\n');

    const crustLines = crustRecipe.length > 0
      ? '\n\nCRUST & TOPPING:\n' + crustRecipe.map(ing => {
          const amt = gramsTo(ing.amount, mode === 'volumetric' ? 'metric' : mode, ing.category);
          return `  • ${ing.name}: ${amt}`;
        }).join('\n')
      : '';

    const printContent = `
      <html>
        <head>
          <title>${selectedPie.name} — PieSensei</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, serif; padding: 40px; max-width: 700px; margin: 0 auto; color: #1a1a1a; }
            .header { border-bottom: 3px solid #d97706; padding-bottom: 16px; margin-bottom: 24px; }
            .logo { font-size: 11px; color: #d97706; font-family: sans-serif; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
            h1 { font-size: 28px; color: #1a1a1a; margin-bottom: 4px; }
            .category { font-size: 13px; color: #888; font-family: sans-serif; }
            .desc { font-size: 14px; color: #555; font-style: italic; margin-bottom: 24px; line-height: 1.6; }
            .meta { display: flex; gap: 24px; margin-bottom: 24px; }
            .meta-item { font-family: sans-serif; font-size: 12px; color: #666; }
            .meta-item strong { display: block; font-size: 15px; color: #1a1a1a; }
            h2 { font-size: 15px; font-family: sans-serif; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; margin-top: 24px; border-bottom: 1px solid #fde68a; padding-bottom: 4px; }
            .ingredient-list { list-style: none; }
            .ingredient-list li { padding: 5px 0; font-size: 14px; border-bottom: 1px dotted #eee; display: flex; justify-content: space-between; }
            .ingredient-list li:last-child { border-bottom: none; }
            .ing-name { color: #333; }
            .ing-amount { color: #555; font-family: sans-serif; font-size: 13px; }
            .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; font-family: sans-serif; text-align: center; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🥧 PieSensei</div>
            <h1>${selectedPie.emoji} ${selectedPie.name}</h1>
            <div class="category">${selectedCategory.name}</div>
          </div>
          ${selectedPie.description ? `<p class="desc">${selectedPie.description}</p>` : ''}
          <div class="meta">
            <div class="meta-item"><strong>${servings}</strong>Slices</div>
            <div class="meta-item"><strong>${gramsTo(metrics.totalWeight, mode === 'volumetric' ? 'metric' : mode, 'default')}</strong>Total Filling Weight</div>
            ${crustMetrics ? `<div class="meta-item"><strong>${gramsTo(crustMetrics.totalWeight, mode === 'volumetric' ? 'metric' : mode, 'default')}</strong>Crust Weight</div>` : ''}
            <div class="meta-item"><strong>${mode === 'metric' ? 'g' : mode === 'imperial' ? 'oz/lb' : 'cups'}</strong>Units</div>
          </div>
          <h2>Filling Ingredients</h2>
          <ul class="ingredient-list">
            ${recipe.map(ing => `<li><span class="ing-name">${ing.name}</span><span class="ing-amount">${gramsTo(ing.amount, mode === 'volumetric' ? 'metric' : mode, ing.category)}</span></li>`).join('')}
          </ul>
          ${crustRecipe.length > 0 ? `
          <h2>Crust & Topping${selectedCrustName ? ` — ${selectedCrustName}` : ''}</h2>
          <ul class="ingredient-list">
            ${crustRecipe.map(ing => `<li><span class="ing-name">${ing.name}</span><span class="ing-amount">${gramsTo(ing.amount, mode === 'volumetric' ? 'metric' : mode, ing.category)}</span></li>`).join('')}
          </ul>` : ''}
          <div class="footer">Printed from PieSensei · piesensei.com</div>
        </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 300);
    }
  };

  const metrics = calculateCakeMetrics(recipe);
  const crustMetrics = crustRecipe.length > 0 ? calculateCakeMetrics(crustRecipe) : null;
  const combinedMetrics = crustRecipe.length > 0 ? calculateCakeMetrics([...recipe, ...crustRecipe]) : null;
  const groupedRecipe = CAT_ORDER.reduce<Record<string, RecipeIngredient[]>>((a, cat) => { const items = recipe.filter(r => r.category === cat); if (items.length) a[cat] = items; return a; }, {});
  const groupedCrust = CAT_ORDER.reduce<Record<string, RecipeIngredient[]>>((a, cat) => { const items = crustRecipe.filter(r => r.category === cat); if (items.length) a[cat] = items; return a; }, {});

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #fef3c7 50%, #fde68a 100%)' }}>
      {/* Header */}
      <header className="text-white shadow-lg" style={{ background: selectedCategory.gradient }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button onClick={() => { setSelectedCategory(null); setSelectedPie(null); }} className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-2xl">{selectedPie.emoji}</span>
              <div>
                <h1 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{selectedPie.name}</h1>
                <p className="text-white/70 text-xs">{selectedCategory.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Measurement mode */}
              <div className="flex bg-white/20 rounded-lg p-0.5">
                {(['metric', 'imperial', 'volumetric'] as MeasurementMode[]).map(m => (
                  <button key={m} onClick={() => setMode(m)} className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${mode === m ? 'bg-white text-gray-800 shadow' : 'text-white hover:bg-white/20'}`}>
                    {m === 'metric' ? 'g' : m === 'imperial' ? 'oz' : 'cups'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1">
                <span className="text-xs text-white/80">Slices:</span>
                <input type="number" value={servings} min={1} max={16} onChange={e => setServings(Math.max(1, parseInt(e.target.value) || 1))} className="w-10 bg-white/20 rounded text-white text-xs text-center outline-none" />
              </div>
              <button
                onClick={handlePrint}
                title="Print recipe"
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-6">

            {/* Filling */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">🥧 Filling Ingredients</h2>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Recipe info card */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-500 italic mb-2">{selectedPie.description}</p>
              </div>

              {Object.entries(groupedRecipe).map(([cat, items]) => (
                <div key={cat} className="mb-4">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 px-1">{CAT_CONFIG[cat]?.emoji} {CAT_CONFIG[cat]?.label ?? cat}</div>
                  {items.map(ing => <IngredientRow key={ing.recipeId} ing={ing} mode={mode} onAmountChange={updateAmount} onSwap={swapIngredient} onRemove={removeIngredient} />)}
                </div>
              ))}
              {recipe.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No ingredients yet. Click Add to start.</div>}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Total Weight</span>
                <span className="text-sm font-bold text-gray-900">{gramsTo(metrics.totalWeight, mode === 'volumetric' ? 'metric' : mode, 'default')}</span>
              </div>
            </div>

            {/* Crust panel */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCrustExpanded(v => !v)} className="flex items-center gap-2 text-left">
                  <span className="text-lg font-bold text-gray-900">🥐 Crust & Topping</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${crustExpanded ? 'rotate-180' : ''}`} />
                </button>
                {crustExpanded && crustRecipe.length > 0 && (
                  <button onClick={() => { setCrustRecipe([]); setSelectedCrustType(null); setSelectedCrustName(null); }} className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-xl transition-colors">
                    🗑️ Clear
                  </button>
                )}
              </div>
              {crustExpanded && (<>
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">🎨 Choose Crust Style</div>
                  <select value={selectedCrustType?.id ?? ''} onChange={e => { const t = crustTypes.find(c => c.id === e.target.value); if (t) selectCrustType(t); }} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white text-gray-700 cursor-pointer">
                    <option value="">— Choose a crust family —</option>
                    {crustTypes.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
                  </select>
                  {selectedCrustType && selectedCrustType.recipes.length > 0 && (<>
                    <select value={selectedCrustName ?? ''} onChange={e => { const p = selectedCrustType.recipes.find(r => r.name === e.target.value); if (p) selectCrust(selectedCrustType, p); }} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white text-gray-700 cursor-pointer">
                      <option value="">— Select a recipe —</option>
                      {(() => {
                        const rec = selectedCrustType.recipes.filter(r => r.pairsWell.includes(selectedCategory.id));
                        const oth = selectedCrustType.recipes.filter(r => !r.pairsWell.includes(selectedCategory.id));
                        return [
                          rec.length > 0 && <optgroup key="r" label={`⭐ Recommended for ${selectedCategory.name}`}>{rec.map(r => <option key={r.name} value={r.name}>{r.emoji} {r.name}</option>)}</optgroup>,
                          oth.length > 0 && <optgroup key="o" label="Other Crusts">{oth.map(r => <option key={r.name} value={r.name}>{r.emoji} {r.name}</option>)}</optgroup>,
                        ];
                      })()}
                    </select>
                    {selectedCrustName && <p className="mt-1.5 text-xs text-gray-400 italic px-1">{selectedCrustType.recipes.find(r => r.name === selectedCrustName)?.description}</p>}
                  </>)}
                </div>
                {Object.entries(groupedCrust).map(([cat, items]) => (
                  <div key={cat} className="mb-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 px-1">{CAT_CONFIG[cat]?.emoji} {CAT_CONFIG[cat]?.label ?? cat}</div>
                    {items.map(ing => <IngredientRow key={ing.recipeId} ing={ing} mode={mode} onAmountChange={updateCrustAmount} onSwap={swapCrustIngredient} onRemove={removeCrustIngredient} />)}
                  </div>
                ))}
                {crustRecipe.length === 0 && <div className="text-center py-6 text-gray-400 text-sm">Select a crust style above or click Add.</div>}
                {crustRecipe.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Crust Weight</span>
                    <span className="text-sm font-bold text-gray-900">
                      {mode === 'imperial' ? (crustMetrics?.totalWeight ?? 0) >= 450 ? `${((crustMetrics?.totalWeight ?? 0) / 453.592).toFixed(2)} lb` : `${((crustMetrics?.totalWeight ?? 0) / 28.3495).toFixed(1)} oz` : `${Math.round(crustMetrics?.totalWeight ?? 0)} g`}
                    </span>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => setShowAddCrust(true)} className="flex items-center justify-center gap-1.5 w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors">
                    <Plus className="w-4 h-4" /> Add Ingredient
                  </button>
                </div>
              </>)}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* Recipe picker */}
            <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedCategory.emoji}</span>
                <span className="text-sm font-bold text-gray-700">{selectedCategory.name}</span>
              </div>
              <select
                value={selectedPie.id}
                onChange={e => handleChangePie(e.target.value)}
                className="w-full text-sm border-2 border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 bg-amber-50 text-gray-800 cursor-pointer font-medium hover:bg-amber-100 transition-colors"
              >
                {selectedCategory.pies.map(p => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                ))}
              </select>
              {selectedPie.techniqueTip && (
                <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs font-semibold text-blue-700 mb-0.5">💡 Technique Tip</div>
                  <div className="text-xs text-blue-800">{selectedPie.techniqueTip}</div>
                </div>
              )}
            </div>

            <div className="flex bg-white rounded-2xl shadow-sm p-1 mb-4">
              {(['metrics', 'nutrition', 'baking'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
                  style={activeTab === tab ? { background: selectedCategory.gradient } : {}}>
                  {tab === 'metrics' ? '🔬 Science' : tab === 'nutrition' ? '📋 Nutrition' : '🔥 Baking'}
                </button>
              ))}
            </div>
            {activeTab === 'metrics' && <MetricsDisplay metrics={metrics} icingMetrics={crustMetrics} combinedMetrics={combinedMetrics} />}
            {activeTab === 'nutrition' && <NutritionFacts metrics={metrics} icingMetrics={crustMetrics} combinedMetrics={combinedMetrics} servingSize={Math.round(metrics.totalWeight / servings)} servingsPerRecipe={servings} />}
            {activeTab === 'baking' && <PieBakingInstructions pieTypeId={selectedCategory.id} recipeName={selectedPie.name} totalWeight={metrics.totalWeight} servings={servings} measurementMode={mode} />}
          </div>
        </div>
      </main>

      {showAdd && <AddModal existing={recipe} onAdd={ing => { addIngredient(ing); }} onClose={() => setShowAdd(false)} />}
      {showAddCrust && <AddModal existing={crustRecipe} onAdd={ing => { addCrustIngredient(ing); }} onClose={() => setShowAddCrust(false)} />}
    </div>
  );
}
