import React from 'react';
import { User } from '../types';
import { SailLogo } from './SailLogo';
import { LogOut, UserCircle, Briefcase, Calendar } from 'lucide-react';

interface SailHeaderProps {
  currentUser: User;
  onLogout: () => void;
  activeTab: number;
  tabNames: string[];
}

export const SailHeader: React.FC<SailHeaderProps> = ({ 
  currentUser, 
  onLogout, 
  activeTab, 
  tabNames 
}) => {
  // Mapping generated image paths to each active tab
  const tabBannerImages: { [key: number]: string } = {
    0: '/src/assets/images/steel_furnace_1782199526168.jpg', // Tab 1: Enter Items
    1: '/src/assets/images/steel_warehouse_1782199580414.jpg', // Tab 2: Tracking / Search
    2: '/src/assets/images/steel_furnace_1782199526168.jpg', // Tab 3: Alerts / Low Stock (molten / furnace warning)
    3: '/src/assets/images/steel_workers_1782199544237.jpg', // Tab 4: Refill Order (workers working)
    4: '/src/assets/images/steel_warehouse_1782199580414.jpg', // Tab 5: Issued / Selling (warehouse / issue)
    5: '/src/assets/images/steel_engineers_1782199562938.jpg', // Tab 6: History & Analytics (engineers working)
  };

  const tabDescriptions: { [key: number]: string } = {
    0: 'Enter and catalog new steel items, grades, structural parameters, and manufacturer units.',
    1: 'Quick real-time stock inquiry system. Retrieve leftover levels, specifications, and safety balances.',
    2: 'Emergency alert index. Real-time items running below critical safety thresholds with fast print options.',
    3: 'Log received materials from external furnaces, upload bill image proofs, and view refill ledgers.',
    4: 'Record structural steel sales and issuances out of the central store to procurement contract firms.',
    5: 'Enterprise inventory velocity insights, long-stagnant products, and bulk purchase analysis.'
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-rose-950/60 text-rose-200 border-rose-800/80';
      case 'Chief Engineer':
        return 'bg-amber-950/60 text-amber-200 border-amber-800/80';
      default:
        return 'bg-blue-950/60 text-blue-200 border-blue-800/80';
    }
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-[#002d62] border-b-4 border-[#ff8c00]" id="sail-portal-header">
      {/* Top Utility and Logo bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4" id="top-branding-row">
        
        {/* Emblem */}
        <div className="flex items-center" id="logo-emblem-wrap">
          <div className="bg-white/95 px-4 py-1.5 rounded-xl flex items-center shadow-md border border-white">
            <SailLogo size={40} />
          </div>
        </div>

        {/* User Info & Actions Section */}
        <div className="flex items-center justify-between md:justify-end gap-4 border-t border-blue-900/60 pt-3 md:pt-0 md:border-none" id="user-info-actions-wrap">
          <div className="flex items-center gap-3" id="user-details-box">
            
            <div className="bg-blue-900/50 p-2 rounded-full hidden sm:block border border-blue-800/50">
              <UserCircle className="w-5 h-5 text-blue-200" />
            </div>

            <div className="flex flex-col text-left" id="user-context">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white leading-none">
                  {currentUser.fullName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeClass(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-200 mt-1 opacity-90">
                <Briefcase className="w-3.5 h-3.5 text-blue-300" />
                <span>{currentUser.department}</span>
              </div>
            </div>

          </div>

          <div className="h-8 w-[1px] bg-blue-800 hidden sm:block" />

          {/* Logout Action */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-blue-900/40 hover:bg-rose-900/40 active:bg-rose-900/60 text-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-blue-800 hover:text-white hover:border-rose-700 shadow-sm cursor-pointer"
            title="Sign out of portal"
            id="btn-logout"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline text-slate-100">Sign Out</span>
          </button>
        </div>

      </div>

      {/* Dynamic Tab-Specific Header Image Banner */}
      <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden" id="tab-hero-banner">
        
        {/* The generated photorealistic header image */}
        <img 
          src={tabBannerImages[activeTab]} 
          alt={tabNames[activeTab]} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 select-none scale-102 hover:scale-100 transition-transform duration-[3000ms]"
          id="tab-hero-image"
        />

        {/* Diagonal Steel Mesh Overlay (CSS patterned mesh to enhance industrial quality) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-950/20 mix-blend-multiply" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#002d62]/30 to-transparent pointer-events-none" />

        {/* Banner text info overlay */}
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6 text-left" id="banner-text-overlay">
          
          <div className="bg-[#ff8c00] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm inline-block mb-2 shadow-sm">
            SAIL CENTRAL INVENTORY REGISTRY &bull; OFFICIAL
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase" id="banner-heading">
            {tabNames[activeTab]}
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed font-sans" id="banner-tagline">
            {tabDescriptions[activeTab]}
          </p>

          {/* Breadcrumb Date */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-2 font-mono" id="banner-date">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>SAIL SYSTEM LOCAL TIME: {getTodayDate()} </span>
          </div>

        </div>

      </div>
    </header>
  );
};
