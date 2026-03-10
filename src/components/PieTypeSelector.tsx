import { useState } from 'react';
import { ChefHat, ChevronRight } from 'lucide-react';
import { PieCategory, PieRecipe } from '../types/pieTypes';
import { PiePantryModal } from './PiePantryModal';

interface PieTypeSelectorProps {
  categories: PieCategory[];
  onSelectCategory: (category: PieCategory, pie: PieRecipe) => void;
}

export function PieTypeSelector({ categories, onSelectCategory }: PieTypeSelectorProps) {
  const [showPantry, setShowPantry] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #fef3c7 50%, #fde68a 100%)' }}>
      <header className="text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #92400e, #b45309, #d97706)' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🥧</span>
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>PieSensei</h1>
                <p className="text-amber-100 text-sm">6 foundations · 30+ recipes · every pie technique covered</p>
              </div>
            </div>
            <button
              onClick={() => setShowPantry(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            >
              <ChefHat className="w-4 h-4" />
              What Can I Make?
            </button>
          </div>
        </div>
      </header>

      {showPantry && (
        <PiePantryModal
          onClose={() => setShowPantry(false)}
          onSelectPie={(category, pie) => {
            setShowPantry(false);
            onSelectCategory(category, pie);
          }}
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ChefHat className="w-6 h-6 text-amber-700" />
              <h2 className="text-2xl font-bold text-gray-800">Choose a Pie Family</h2>
            </div>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Select a category to open the formula editor. Switch between individual recipes using the dropdown inside.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat, cat.pies[0])}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden text-left group hover:scale-[1.02] border-2 border-transparent hover:border-amber-300"
              >
                <div className="h-2 w-full" style={{ background: cat.gradient }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{cat.emoji}</span>
                    <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                      {cat.pies.length} recipes
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cat.description}</p>

                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold text-gray-500">🥐 Crust: </span>{cat.crustType}
                  </div>
                  <div className="text-xs text-gray-400 italic mb-4 line-clamp-2">🔬 {cat.scienceNote}</div>

                  {/* Pie list preview */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Includes</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.pies.map(pie => (
                        <span key={pie.id} className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
                          {pie.emoji} {pie.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
