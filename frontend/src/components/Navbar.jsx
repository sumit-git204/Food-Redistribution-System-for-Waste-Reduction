import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Bell, LogOut, User, Store } from 'lucide-react';

export const Navbar = ({ onOpenQRScanner, alertCount }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-30 px-6 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Leaf className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent tracking-tight">
              EcoSave
            </h1>
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
              Food Redistribution AI System
            </p>
          </div>
        </div>

        {/* Center - Organization Badge */}
        {user?.orgName && (
          <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full text-emerald-800 text-xs font-semibold">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user.orgName}</span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Quick Scanner Action */}
          <button
            onClick={onOpenQRScanner}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all hover:shadow"
          >
            <span className="text-sm">📷</span>
            <span className="hidden sm:inline">Scan Barcode / QR</span>
          </button>

          {/* Alert Notification Button */}
          <div className="relative">
            <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors">
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {alertCount}
                </span>
              )}
            </button>
          </div>

          {/* User profile dropdown */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 font-medium capitalize">{user?.role?.replace('_', ' ') || 'Admin'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
