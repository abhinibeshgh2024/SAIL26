import { useState, useEffect } from 'react';
import { User, SteelItem, RefillOrder, IssueSales } from './types';
import { getCurrentUser, getItems, getOrders, getIssues, logout, initLocalStorageDB } from './utils/db';
import { AccessControl } from './components/AccessControl';
import { SailHeader } from './components/SailHeader';
import { TabItemEntry } from './components/TabItemEntry';
import { TabSearchTracking } from './components/TabSearchTracking';
import { TabAlerts } from './components/TabAlerts';
import { TabRefill } from './components/TabRefill';
import { TabIssueCompany } from './components/TabIssueCompany';
import { TabAnalytics } from './components/TabAnalytics';
import { AIAssistant } from './components/AIAssistant';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  Search, 
  ShieldAlert, 
  CornerDownRight, 
  ShoppingCart, 
  BarChart4,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live collections
  const [items, setItems] = useState<SteelItem[]>([]);
  const [orders, setOrders] = useState<RefillOrder[]>([]);
  const [issues, setIssues] = useState<IssueSales[]>([]);

  // Initialize DB & load states on mount
  useEffect(() => {
    initLocalStorageDB();
    setCurrentUser(getCurrentUser());
    reloadDatabaseMemory();
  }, []);

  const reloadDatabaseMemory = () => {
    setItems(getItems());
    setOrders(getOrders());
    setIssues(getIssues());
  };

  const handleLogoutAction = () => {
    logout();
    setCurrentUser(null);
    setActiveTab(0);
  };

  const tabNames = [
    'Catalog Registry',
    'Material Search',
    'Buffer Warnings',
    'Inward Refills',
    'Outward Dispatch',
    'History & Analytics'
  ];

  const getTabIcon = (index: number) => {
    switch (index) {
      case 0: return <PlusCircle className="w-4 h-4" />;
      case 1: return <Search className="w-4 h-4" />;
      case 2: return <ShieldAlert className="w-4 h-4" />;
      case 3: return <CornerDownRight className="w-4 h-4" />;
      case 4: return <ShoppingCart className="w-4 h-4" />;
      default: return <BarChart4 className="w-4 h-4" />;
    }
  };

  // Double check how many items are currently running low to show as indicator inside alerts tab badge
  const lowItemsCount = items.filter(
    (item) => item.leftoverStock < item.neededAverageQuantity * 0.5
  ).length;

  if (!currentUser) {
    return (
      <AccessControl 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          reloadDatabaseMemory();
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased" id="portal-app-root">
      
      {/* Dynamic Header Banners */}
      <SailHeader 
        currentUser={currentUser} 
        onLogout={handleLogoutAction} 
        activeTab={activeTab} 
        tabNames={tabNames} 
      />

      {/* Main Tab Navigation Row / Modular Mobile Toggling Menu Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm" id="sticky-navy-bar">
        <div className="max-w-7xl mx-auto">
          
          {/* Mobile Toggling Menu Bar (Visible exclusively on phone view below md breakpoint) */}
          <div className="block md:hidden border-b border-slate-100 bg-slate-50" id="mobile-tabs-toggling-bar">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[#002d62]">
                  {getTabIcon(activeTab)}
                </span>
                <span className="text-xs font-black uppercase text-[#002d62] tracking-wider select-none">
                  {tabNames[activeTab]}
                </span>
                {activeTab === 2 && lowItemsCount > 0 && (
                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center animate-pulse">
                    {lowItemsCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-1 bg-[#002d62] hover:bg-[#00224b] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-all select-none cursor-pointer border-b-2 border-b-[#ff8c00] active:scale-95 outline-none"
                id="mobile-menu-toggle-btn"
              >
                <span>{isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}</span>
                {isMobileMenuOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#ff8c00]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#ff8c00]" />
                )}
              </button>
            </div>

            {/* Mobile Navigation List - Animated Collapsible Dropdown */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="overflow-hidden bg-white border-t border-slate-200 divide-y divide-slate-100 shadow-xl"
                  id="mobile-tabs-expanded-list"
                >
                  {tabNames.map((name, idx) => {
                    const isSelected = activeTab === idx;
                    return (
                      <button
                        key={name}
                        onClick={() => {
                          setActiveTab(idx);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all select-none text-left cursor-pointer outline-none ${
                          isSelected 
                            ? 'bg-slate-50 text-[#002d62] border-l-4 border-l-[#ff8c00] font-bold' 
                            : 'hover:bg-slate-50/50 text-slate-400 hover:text-[#002d62]'
                        }`}
                        id={`mob-nav-tab-${idx}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={isSelected ? 'text-[#002d62]' : 'text-slate-400'}>
                            {getTabIcon(idx)}
                          </span>
                          <span>{name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {idx === 2 && lowItemsCount > 0 && (
                            <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center">
                              {lowItemsCount}
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[8px] bg-amber-100 text-[#ff8c00] px-1.5 py-0.5 font-bold uppercase tracking-tight">Active</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Row (visible on md screens and higher) */}
          <nav className="hidden md:flex overflow-x-auto scrollbar-none" id="dashboard-navbar">
            {tabNames.map((name, idx) => {
              const isSelected = activeTab === idx;
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer select-none whitespace-nowrap focus:outline-none flex-1 min-w-[130px] sm:min-w-0 ${
                    isSelected 
                      ? 'border-b-2 border-[#ff8c00] bg-slate-50 text-[#002d62]' 
                      : 'border-b-2 border-transparent hover:bg-slate-50/80 text-slate-400'
                  }`}
                  id={`nav-tab-${idx}`}
                >
                  <span className={isSelected ? 'text-[#002d62]' : 'text-slate-400'}>
                    {getTabIcon(idx)}
                  </span>
                  <span>{name}</span>
                  {idx === 2 && lowItemsCount > 0 && (
                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center animate-pulse" id="alert-badge-count">
                      {lowItemsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Tab viewport stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="portal-stage">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="focus:outline-none"
            id={`tab-motion-viewport-${activeTab}`}
          >
            {activeTab === 0 && (
              <TabItemEntry 
                items={items} 
                onMutationSuccess={reloadDatabaseMemory} 
              />
            )}

            {activeTab === 1 && (
              <TabSearchTracking 
                items={items} 
              />
            )}

            {activeTab === 2 && (
              <TabAlerts 
                items={items} 
              />
            )}

            {activeTab === 3 && (
              <TabRefill 
                items={items} 
                orders={orders} 
                onMutationSuccess={reloadDatabaseMemory} 
              />
            )}

            {activeTab === 4 && (
              <TabIssueCompany 
                items={items} 
                issues={issues} 
                currentUser={currentUser} 
                onMutationSuccess={reloadDatabaseMemory} 
              />
            )}

            {activeTab === 5 && (
              <TabAnalytics 
                items={items} 
                issues={issues} 
                orders={orders} 
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Persistent Page Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500" id="portal-global-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-semibold tracking-wider uppercase text-slate-400">
            Steel Authority of India Limited &bull; stores administration &amp; logistics
          </p>
          <p className="font-mono text-[10px]">
            Connected with local storage sandbox database Engine &bull; System Status: <span className="text-emerald-500 font-bold">● ONLINE</span>
          </p>
          <p className="text-[10px] text-slate-600">
            Registered office: Ispat Bhawan, Lodi Road, New Delhi - 110003 &bull; Licensed for Bokaro, Bhilai, Rourkela, Durgapur, IISCO allocations.
          </p>
        </div>
      </footer>

      {/* Enterprise-grade Live RAG Core Assessment Companion */}
      <AIAssistant 
        items={items}
        orders={orders}
        issues={issues}
      />

    </div>
  );
}
