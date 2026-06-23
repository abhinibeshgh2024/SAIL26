import React, { useState } from 'react';
import { SteelItem } from '../types';
import { Search, Compass, PackageOpen, AlertTriangle, CheckCircle, ShieldAlert, ThermometerSun } from 'lucide-react';

interface TabSearchTrackingProps {
  items: SteelItem[];
}

export const TabSearchTracking: React.FC<TabSearchTrackingProps> = ({ items }) => {
  const [query, setQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(items[0]?.itemId || null);

  // Search filter
  const filteredItems = items.filter(item => 
    item.itemId.toLowerCase().includes(query.toLowerCase()) ||
    item.itemName.toLowerCase().includes(query.toLowerCase()) ||
    item.companyName.toLowerCase().includes(query.toLowerCase())
  );

  const selectedItem = items.find(i => i.itemId === selectedItemId) || filteredItems[0] || null;

  const getPercentage = (item: SteelItem) => {
    return Math.min(100, Math.round((item.leftoverStock / item.neededAverageQuantity) * 100));
  };

  const getHealthStatus = (item: SteelItem) => {
    const ratio = item.leftoverStock / item.neededAverageQuantity;
    if (item.leftoverStock === 0) return { label: 'STOCK EXHAUSTED', color: 'text-rose-500 bg-rose-50 border-rose-200', icon: ShieldAlert };
    if (ratio < 0.5) return { label: 'CRITICAL WARNING: REFILL NOW', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertTriangle };
    return { label: 'HEALTHY SAFETY BUFFER', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="tab-search-tracking-root">
      
      {/* Search Sidebar & Quick List (1 Column) */}
      <div className="md:col-span-1 flex flex-col h-[400px] md:h-[500px]" id="search-sidebar">
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-4 flex flex-col h-full relative" id="search-sidebar-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
          
          <div className="relative mb-4 mt-1" id="search-input-wrapper">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by steel ID, name or mill..."
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-sans"
              id="input-query"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>

          <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest block" id="search-results-lbl">
            Stock Registry List ({filteredItems.length} matched)
          </span>

          {/* Matches List box */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1" id="matches-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-semibold" id="empty-search-alert">
                No items match your inquiry search.
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = item.itemId === selectedItem?.itemId;
                const ratio = item.leftoverStock / item.neededAverageQuantity;

                return (
                  <button
                    key={item.itemId}
                    onClick={() => setSelectedItemId(item.itemId)}
                    className={`w-full text-left p-3 rounded-none my-1 transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-50 border-slate-200 border-l-4 border-l-[#ff8c00] text-[#002d62] font-bold shadow-sm' 
                        : 'bg-white border-transparent hover:bg-slate-50 text-slate-700 border-l-4 border-l-transparent'
                    }`}
                    id={`btn-search-item-${item.itemId}`}
                  >
                    <div className="flex flex-col min-w-0" id={`wrap-search-item-${item.itemId}`}>
                      <span className="text-xs font-mono font-bold tracking-tight uppercase block leading-none">{item.itemId}</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-1 truncate block">{item.itemName}</span>
                    </div>
                    
                    {/* Leftover state pill */}
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-none border ${
                      item.leftoverStock === 0 
                        ? 'bg-rose-50 text-rose-800 border-rose-200' 
                        : ratio < 0.5 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {item.leftoverStock} MT
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Item Specifications details Card (2 Columns) */}
      <div className="md:col-span-2" id="search-results-details">
        {selectedItem ? (
          <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 relative overflow-hidden" id="details-panel-card">
            
            {/* Top heavy steel structural border accent */}
            <div className="absolute top-0 inset-x-0 h-1 ml-0 bg-[#ff8c00]" />
            <div className="absolute top-1 inset-x-0 h-1.5 ml-0 bg-[#002d62]" />
            
            {/* Headline Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6 mt-1" id="details-card-header">
              <div id="details-header-title">
                <span className="text-2xl font-mono font-black text-[#002d62] tracking-wider uppercase block leading-none" id="details-item-id">
                  {selectedItem.itemId}
                </span>
                <h3 className="text-base font-bold text-slate-800 tracking-tight mt-2.5" id="details-item-name">
                  {selectedItem.itemName}
                </h3>
              </div>

              {/* Status Banner */}
              <div id="details-header-status">
                {(() => {
                  const health = getHealthStatus(selectedItem);
                  const Icon = health.icon;
                  return (
                    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-none border text-[10px] uppercase tracking-wider font-bold ${health.color}`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{health.label}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Grid display layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="details-spec-grid">
              
              {/* Technical properties */}
              <div className="space-y-4" id="details-specs-left">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                  Technical Specifications
                </h4>

                <div className="grid grid-cols-2 gap-4" id="specs-layout-card">
                  <div className="bg-[#f8fafc] p-3 rounded-none border border-slate-100" id="spec-category">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide block">Material Category</span>
                    <strong className="text-xs text-[#002d62] block mt-1 font-sans">{selectedItem.category}</strong>
                  </div>

                  <div className="bg-[#f8fafc] p-3 rounded-none border border-slate-100" id="spec-supplier">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide block">Manufacturer Unit</span>
                    <strong className="text-xs text-[#002d62] block mt-1 font-sans truncate" title={selectedItem.companyName}>
                      {selectedItem.companyName.replace('SAIL', '').trim()}
                    </strong>
                  </div>

                  <div className="bg-[#f8fafc] p-3 rounded-none border border-slate-100" id="spec-annual">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide block">Annual Predicted allocation</span>
                    <strong className="text-xs text-slate-900 font-mono font-bold block mt-1">
                      {selectedItem.annualQuantity.toLocaleString('en-IN')} MT
                    </strong>
                  </div>

                  <div className="bg-[#f8fafc] p-3 rounded-none border border-slate-100" id="spec-average">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide block">Safety Buffer Target</span>
                    <strong className="text-xs text-slate-900 font-mono font-bold block mt-1">
                      {selectedItem.neededAverageQuantity.toLocaleString('en-IN')} MT
                    </strong>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2 mt-4" id="specs-activity-dates">
                  <div className="flex justify-between items-center text-xs" id="date-last-refilled">
                    <span className="text-slate-500 font-medium">Last Inward Refill Date:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedItem.lastOrderedDate ? selectedItem.lastOrderedDate : 'No record'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs" id="date-last-issued">
                    <span className="text-slate-500 font-medium">Last Outward Issue Date:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedItem.lastIssuedDate ? selectedItem.lastIssuedDate : 'No record'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphical representation thermometer */}
              <div className="bg-[#f8fafc] border border-slate-200/60 rounded-none p-6 flex flex-col items-center justify-center relative" id="details-specs-right-visual">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest absolute top-4">
                  Buffer Level Indicator
                </h4>

                <div className="flex flex-col items-center justify-center mt-4" id="visual-level-group">
                  {/* Circular style gauge */}
                  <div className="relative flex items-center justify-center w-32 h-32" id="gauge-circle-outer">
                    {/* Background track circle */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="#e2e8f0" 
                        strokeWidth="8" 
                        fill="transparent" 
                      />
                      {/* Interactive line */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke={selectedItem.leftoverStock === 0 ? '#ef4444' : getPercentage(selectedItem) < 50 ? '#f59e0b' : '#10b981'} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - getPercentage(selectedItem) / 100)}
                        strokeLinecap="butt"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center" id="gauge-numbers">
                      <span className="text-2xl font-mono font-black text-[#002d62]">
                        {selectedItem.leftoverStock}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        Metric Tons
                      </span>
                    </div>
                  </div>

                  <div className="text-center mt-4" id="gauge-summary-text">
                    <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                      Leftover inventory stock: <strong className="font-mono font-bold text-slate-900">{getPercentage(selectedItem)}%</strong> of target safety buffer level <span className="font-mono">({selectedItem.neededAverageQuantity} MT)</span>.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="bg-[#f8fafc] border border-slate-200 border-dashed rounded-none p-12 text-center text-slate-400 font-semibold" id="no-item-selected-fallback">
            <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p>Please register steel products inside Tab 1 or adjust search filter keywords to view product specifications.</p>
          </div>
        )}
      </div>

    </div>
  );
};
