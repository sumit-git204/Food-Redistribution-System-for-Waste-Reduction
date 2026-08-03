import React, { useState, useEffect } from 'react';
import API, { MOCK_TAXONOMY } from '../services/api';
import { Tag, ShieldAlert, Thermometer, Calendar, Layers } from 'lucide-react';

export const TaxonomyPage = () => {
  const [categories, setCategories] = useState(MOCK_TAXONOMY);

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const res = await API.get('/taxonomy');
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.warn('Using default food taxonomy categories');
      }
    };
    fetchTaxonomy();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Food Taxonomy & Perishability System</h2>
        <p className="text-xs text-slate-500 font-medium">Categorization rules, storage guidance & automated risk thresholds</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.category} className="eco-card p-5 bg-white space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800 flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>{cat.category}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  cat.perishabilityRisk === 'High' ? 'badge-critical' : 'badge-safe'
                }`}>
                  {cat.perishabilityRisk} Risk
                </span>
              </div>

              <p className="text-xs text-slate-500">{cat.description}</p>
            </div>

            <div className="pt-3 border-t border-emerald-50 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <div className="flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                <span>{cat.storageType}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Default Threshold: <strong className="text-emerald-800">{cat.defaultExpiryThresholdDays}d</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
