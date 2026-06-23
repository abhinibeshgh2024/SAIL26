import React from 'react';
import { SteelItem } from '../types';
import { exportToExcel, exportToPDF } from '../utils/export';
import { ShieldAlert, FileSpreadsheet, FileText, CheckCircle, PackageOpen } from 'lucide-react';

interface TabAlertsProps {
  items: SteelItem[];
}

export const TabAlerts: React.FC<TabAlertsProps> = ({ items }) => {
  // Low Stock condition: current stock is below 50% of the average safety stock needed
  const lowStockItems = items.filter(
    (item) => item.leftoverStock < item.neededAverageQuantity * 0.5
  );

  const getDeficitPercent = (item: SteelItem) => {
    return Math.round((item.leftoverStock / item.neededAverageQuantity) * 100);
  };

  const handleExportExcel = () => {
    if (lowStockItems.length === 0) return;

    const headers = [
      'Steel Item ID',
      'Commercial Description',
      'Category Group',
      'Manufacturing Yard',
      'Leftover Inventory (MT)',
      'Safety Buffer Target (MT)',
      'Baseline Ratio (%)',
      'Annual predicted Consumption (MT)'
    ];

    const rows = lowStockItems.map((item) => [
      item.itemId,
      item.itemName,
      item.category,
      item.companyName,
      item.leftoverStock,
      item.neededAverageQuantity,
      getDeficitPercent(item),
      item.annualQuantity
    ]);

    exportToExcel(headers, rows, `SAIL_Low_Stock_Audit_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDF = () => {
    if (lowStockItems.length === 0) return;

    const headers = ['ID', 'Item Description', 'Yard', 'Stock (MT)', 'Target Need (MT)', 'Fill Level & Ratio'];
    const rows = lowStockItems.map((item) => [
      item.itemId,
      item.itemName,
      item.companyName.replace('SAIL', '').trim(),
      `${item.leftoverStock} MT`,
      `${item.neededAverageQuantity} MT`,
      `${getDeficitPercent(item)}% (CRITICAL)`
    ]);

    const metadata = [
      { label: 'Security Classification', value: 'INTERNAL STORES AUDIT UNIT' },
      { label: 'Total Low Stock Items Listed', value: `${lowStockItems.length} Products` },
      { label: 'Trigger Threshold Filter', value: 'Stock is < 50% of Safety Buffer Level' },
      { label: 'Oversight Division', value: 'SAIL Central Stores Depot Area' }
    ];

    exportToPDF('CRITICAL LOW STOCK NOTIFICATION LISTING', headers, rows, metadata);
  };

  return (
    <div className="space-y-6" id="tab-alerts-root">
      
      {/* Overview stats panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="alerts-stats-grid">
        <div className="bg-rose-50 border-l-4 border-rose-600 border-t border-r border-b border-slate-200 rounded-none p-5 relative overflow-hidden" id="stat-alert-count-box">
          <div className="absolute right-4 top-4 bg-rose-200/40 p-2 rounded-none">
            <ShieldAlert className="w-6 h-6 text-rose-700 font-bold" />
          </div>
          <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Critical Low Items</span>
          <strong className="text-3xl font-mono font-black text-rose-950 block mt-2">
            {lowStockItems.length}
          </strong>
          <p className="text-[10px] text-rose-800 font-semibold mt-1.5 font-sans">
            Products operating on critical reserve margins.
          </p>
        </div>

        <div className="bg-emerald-50 border-l-4 border-emerald-600 border-t border-r border-b border-slate-200 rounded-none p-5 relative overflow-hidden" id="stat-healthy-count-box">
          <div className="absolute right-4 top-4 bg-emerald-200/40 p-2 rounded-none">
            <CheckCircle className="w-6 h-6 text-emerald-700" />
          </div>
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Healthy Inventory Items</span>
          <strong className="text-3xl font-mono font-black text-emerald-950 block mt-2">
            {items.length - lowStockItems.length}
          </strong>
          <p className="text-[10px] text-emerald-800 font-semibold mt-1.5 font-sans">
            Products fully secured by safety margins.
          </p>
        </div>

        {/* Action button panel */}
        <div className="bg-white border border-slate-200 rounded-none p-5 flex flex-col justify-center gap-3 shadow-sm relative overflow-hidden" id="action-exports-card">
          <div className="absolute top-0 right-0 w-2.5 h-full bg-[#002d62]" />
          <span className="text-[11px] text-slate-500 font-black tracking-widest uppercase block text-left mb-1">
            Export Low Stock Registries
          </span>
          <div className="grid grid-cols-2 gap-3" id="exports-wrapper-group">
            <button
              onClick={handleExportPDF}
              disabled={lowStockItems.length === 0}
              className="flex items-center justify-center gap-2 bg-[#002d62] hover:bg-[#00224b] disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-wide transition-all shadow-sm border-b-4 border-[#ff8c00] cursor-pointer disabled:cursor-not-allowed"
              id="btn-alert-pdf"
            >
              <FileText className="w-4 h-4 shrink-0 text-[#ff8c00]" />
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              disabled={lowStockItems.length === 0}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 text-slate-100 py-2.5 rounded-none text-xs font-bold uppercase tracking-wide transition-all shadow-sm border-b-4 border-slate-600 cursor-pointer disabled:cursor-not-allowed"
              id="btn-alert-excel"
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0 text-slate-300" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Main warning table view */}
      <div className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden p-6 relative" id="alerts-table-container">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
        
        <div className="flex items-center gap-2 mb-5 mt-1" id="alerts-table-header">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
            Urgent Dispatch Refill Warnings
          </h3>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-none p-8 text-center" id="all-secured-banner">
            <div className="bg-white p-3 rounded-none inline-block max-w-[50px] shadow-sm mb-3 border border-slate-100">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-emerald-950 font-sans tracking-widest uppercase">
              INVENTORY STOCKS SECURED
            </h4>
            <p className="text-xs text-emerald-700 max-w-md mx-auto mt-1 strategy-desc leading-relaxed">
              Congratulations. All registered store materials reside above the 50% safety buffer threshold limit. No warning dispatch order triggers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-none" id="alerts-table-scroll-wrapper">
            <table className="min-w-full divide-y divide-slate-200 text-left" id="alerts-list-table">
              <thead>
                <tr className="bg-slate-50" id="alerts-th-row">
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Item details</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Manufacturing plant</th>
                  <th scope="col" className="px-4 py-3.5 text-right text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Target Need</th>
                  <th scope="col" className="px-4 py-3.5 text-right text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Current Stock</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Deficit Margin</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Deficit Level status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white" id="alerts-tb-body">
                {lowStockItems.map((item) => {
                  const percent = getDeficitPercent(item);

                  return (
                    <tr key={item.itemId} className="hover:bg-rose-50/10 transition-colors" id={`alert-row-${item.itemId}`}>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-[#002d62] tracking-tight uppercase">{item.itemId}</span>
                          <span className="text-xs font-medium text-slate-700 mt-1 max-w-sm truncate" title={item.itemName}>{item.itemName}</span>
                          <span className="text-[9px] bg-rose-50 text-rose-800 rounded-none px-1.5 py-0.5 inline-block w-fit mt-1.5 font-bold font-mono border border-rose-200/50">{item.category}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-slate-600">
                        {item.companyName.replace('SAIL', '').trim()}
                      </td>

                      <td className="px-4 py-4 text-right text-xs font-mono font-bold text-slate-800">
                        {item.neededAverageQuantity.toLocaleString('en-IN')} MT
                      </td>

                      <td className="px-4 py-4 text-right text-xs font-mono font-bold text-rose-600">
                        {item.leftoverStock.toLocaleString('en-IN')} MT
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-mono font-bold text-rose-800">
                            -{(item.neededAverageQuantity - item.leftoverStock).toLocaleString('en-IN')} MT
                          </span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-none overflow-hidden mt-1.5 border border-slate-200/50">
                            <div className="h-full bg-rose-600 rounded-none" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="text-[8px] text-rose-400 font-mono font-semibold mt-1">{percent}% filled</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex px-2.5 py-0.5 items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold rounded-none border bg-amber-50 text-amber-800 border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          LOW STOCKS
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
