import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Clock, BarChart3, Settings } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Inventory Management', path: '/inventory', icon: Package },
    { label: 'Expiry Alerts', path: '/alerts', icon: Clock },
    { label: 'Food Taxonomy', path: '/taxonomy', icon: Tag },
  ];

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-md border-r border-emerald-100 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/20'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-sm space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🌱</span>
          <p className="font-bold text-xs">Zero Waste Mission</p>
        </div>
        <p className="text-[11px] text-emerald-100 leading-snug">
          Track expiry dates & reduce avoidable landfill food waste.
        </p>
      </div>
    </aside>
  );
};
