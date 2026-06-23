import React from 'react';
import { SteelItem, IssueSales, RefillOrder } from '../types';
import { getAnalytics } from '../utils/db';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { TrendingDown, Hourglass, Landmark, Flame, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface TabAnalyticsProps {
  items: SteelItem[];
  issues: IssueSales[];
  orders: RefillOrder[];
}

export const TabAnalytics: React.FC<TabAnalyticsProps> = ({ items, issues, orders }) => {
  const analytics = getAnalytics();

  // Format money for hover tooltips
  const formatRUPEETooltip = (value: any) => {
    return [`${Number(value).toLocaleString('en-IN')} MT`, 'Quantity'];
  };

  // ----------------------------------------------------
  // Chart 1: Stock Velocity (Running Out Faster)
  // ----------------------------------------------------
  const velocityChartData = analytics.runningOutFaster.slice(0, 5).map(item => ({
    name: item.itemId,
    Tonnage: item.totalIssued,
    Shipments: item.issueCount
  }));

  // ----------------------------------------------------
  // Chart 2: Purchase Volumes (Purchased in Large Amounts)
  // ----------------------------------------------------
  const purchaseChartData = analytics.largePurchases.slice(0, 5).map(item => ({
    name: item.itemId,
    Received: item.totalReceived,
    Refills: item.refillCount
  }));

  return (
    <div className="space-y-8" id="tab-analytics-root">
      
      {/* Visual Analytics KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="analytics-kpis">
        
        {/* Highest velocity KPI item */}
        <div className="bg-[#002d62] text-white rounded-none p-6 relative overflow-hidden shadow-sm border-b-4 border-b-[#ff8c00]" id="kpi-velocity-box">
          <div className="absolute right-4 top-4 bg-white/10 p-2.5 rounded-none">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest block">Top Moving Line</span>
          {analytics.runningOutFaster[0] ? (
            <div className="mt-3">
              <strong className="text-xl font-mono font-black text-white uppercase block">
                {analytics.runningOutFaster[0].itemId}
              </strong>
              <span className="text-xs text-slate-200 mt-1 block max-w-[200px] truncate">
                {analytics.runningOutFaster[0].itemName}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#ff8c00] font-bold mt-2 font-mono">
                <ArrowUpRight className="w-4 h-4" />
                <span>{analytics.runningOutFaster[0].totalIssued.toLocaleString('en-IN')} MT Issued</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500 mt-3 block font-sans">No shipments recorded yet</span>
          )}
        </div>

        {/* Longest Stagnant KPI item */}
        <div className="bg-[#002d62] text-white rounded-none p-6 relative overflow-hidden shadow-sm border-b-4 border-b-indigo-500" id="kpi-stagnant-box">
          <div className="absolute right-4 top-4 bg-white/10 p-2.5 rounded-none">
            <Hourglass className="w-5 h-5 text-indigo-300 animate-pulse" />
          </div>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest block">Longest Idle In Store</span>
          {analytics.stagnantProducts[0] ? (
            <div className="mt-3">
              <strong className="text-xl font-mono font-black text-white uppercase block">
                {analytics.stagnantProducts[0].itemId}
              </strong>
              <span className="text-xs text-slate-200 mt-1 block max-w-[200px] truncate">
                {analytics.stagnantProducts[0].itemName}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold mt-2 font-mono">
                <span>{analytics.stagnantProducts[0].lastActivityDays === 999 ? 'No dispatch logs ever' : `Idle : ${analytics.stagnantProducts[0].lastActivityDays} Days`}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500 mt-3 block font-sans">No idle products</span>
          )}
        </div>

        {/* Highest Capital stock received KPI item */}
        <div className="bg-[#002d62] text-white rounded-none p-6 relative overflow-hidden shadow-sm border-b-4 border-b-emerald-500" id="kpi-procurement-box">
          <div className="absolute right-4 top-4 bg-white/10 p-2.5 rounded-none">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest block">Highest Inward Refill Volume</span>
          {analytics.largePurchases[0] ? (
            <div className="mt-3">
              <strong className="text-xl font-mono font-black text-white uppercase block">
                {analytics.largePurchases[0].itemId}
              </strong>
              <span className="text-xs text-slate-200 mt-1 block max-w-[200px] truncate">
                {analytics.largePurchases[0].itemName}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-2 font-mono">
                <ArrowUpRight className="w-4 h-4 rotate-90" />
                <span>{analytics.largePurchases[0].totalReceived.toLocaleString('en-IN')} MT Received</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500 mt-3 block font-sans">No refills recorded yet</span>
          )}
        </div>

      </div>

      {/* Analytics chart and table reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="analytics-charts-grid">
        
        {/* Chart Card 1: Velocity (Running Out Faster) */}
        <div className="bg-white border border-slate-200 rounded-none p-6 shadow-sm flex flex-col relative overflow-hidden" id="chart-velocity-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
          
          <div className="flex items-center gap-2.5 mb-4 mt-1" id="chart-velocity-hdr">
            <TrendingDown className="w-5 h-5 text-[#002d62]" />
            <div>
              <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
                Dispatched Stock Velocity (Running Out Faster)
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">Tonnage issued out of store during current operational period (Top 5 items).</p>
            </div>
          </div>

          <div className="h-64 flex-1 mt-4" id="chart-velocity-container">
            {velocityChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-sans">No sales transactions available to map.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip formatter={formatRUPEETooltip} contentStyle={{ fontSize: '11px', borderRadius: '0px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Tonnage" fill="#002d62" name="Issued Tonnage (MT)" radius={[0, 0, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart Card 2: Highest Acquisitions (Purchased in Large Amounts) */}
        <div className="bg-white border border-slate-200 rounded-none p-6 shadow-sm flex flex-col relative overflow-hidden" id="chart-acquisitions-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
          
          <div className="flex items-center gap-2.5 mb-4 mt-1" id="chart-acquisitions-hdr">
            <Landmark className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">
                Refill Acquisition Volume (Purchased in Large Sizes)
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">Cumulative inward tonnage refills delivered into warehouse yard racks (Top 5 items).</p>
            </div>
          </div>

          <div className="h-64 flex-1 mt-4" id="chart-acquisition-container">
            {purchaseChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-sans">No refill order transactions available to map.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={purchaseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip formatter={formatRUPEETooltip} contentStyle={{ fontSize: '11px', borderRadius: '0px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Area type="monotone" dataKey="Received" stroke="#059669" fill="#e6f4ea" name="Received Quality (MT)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row: Stagnant products inspection table */}
      <div className="bg-white border border-slate-200 rounded-none p-6 shadow-sm relative overflow-hidden" id="stagnant-table-card">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
        
        <div className="flex items-center gap-2.5 mb-5 mt-1" id="stagnant-hdr">
          <Hourglass className="w-5 h-5 text-[#002d62] animate-none" />
          <div>
            <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
              Warehouse Idle Stocks inspection (Not selling for long)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">Identifies inactive reserve steel stocks occupying shelf area without active issue logs.</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-none bg-white" id="stagnant-table-scroll bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left" id="stagnant-checking-table">
            <thead>
              <tr className="bg-slate-50" id="stagnant-th-row">
                <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Item Reference</th>
                <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Product Name</th>
                <th scope="col" className="px-4 py-3.5 text-right text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Leftover Stock Balance</th>
                <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Days Since Last Sale Issue</th>
                <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Warehouse space Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white" id="stagnant-tb-body">
              {analytics.stagnantProducts.map((p) => {
                const neverSold = p.lastActivityDays === 999;
                const isStagnant = p.lastActivityDays > 45 || neverSold;

                return (
                  <tr key={p.itemId} className="hover:bg-[#f8fafc] transition-colors" id={`stagnant-row-${p.itemId}`}>
                    <td className="px-4 py-3.5 text-xs font-mono font-bold text-slate-800 uppercase">{p.itemId}</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{p.itemName}</td>
                    <td className="px-4 py-3.5 text-right text-xs font-mono font-bold text-slate-800">{p.leftoverStock} MT</td>
                    <td className="px-4 py-3.5 text-center text-xs font-mono font-bold">
                      {neverSold ? (
                        <span className="text-indigo-600">No active sale log recorded</span>
                      ) : (
                        <span className={isStagnant ? 'text-amber-600' : 'text-slate-600'}>
                          {p.lastActivityDays} Active Days Idle
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {isStagnant ? (
                        <span className="inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-none border bg-violet-50 text-violet-800 border-violet-200">
                          STAGNANT SPACE ACCUMULATION
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-none border bg-emerald-50 text-emerald-800 border-emerald-200">
                          ACTIVE CYCLE STOCK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
