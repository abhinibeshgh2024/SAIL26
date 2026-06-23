import React, { useState } from 'react';
import { SteelItem } from '../types';
import { getItems, saveItem } from '../utils/db';
import { PlusCircle, Search, ClipboardList, Package, Layers, Info } from 'lucide-react';

interface TabItemEntryProps {
  onMutationSuccess: () => void;
  items: SteelItem[];
}

export const TabItemEntry: React.FC<TabItemEntryProps> = ({ onMutationSuccess, items }) => {
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [annualQuantity, setAnnualQuantity] = useState<number | ''>('');
  const [neededAverageQuantity, setNeededAverageQuantity] = useState<number | ''>('');
  const [companyName, setCompanyName] = useState('SAIL Bokaro Steel Plant (BSL)');
  const [category, setCategory] = useState('Plates');
  
  // feedback status
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!itemId || !itemName || !annualQuantity || !neededAverageQuantity || !companyName) {
      setError("Please fill out all technical fields before registering.");
      return;
    }

    if (Number(annualQuantity) <= 0 || Number(neededAverageQuantity) <= 0) {
      setError("Quantities must be strictly positive numeric values.");
      return;
    }

    try {
      const saved = saveItem({
        itemId: itemId.trim().toUpperCase(),
        itemName: itemName.trim(),
        annualQuantity: Number(annualQuantity),
        neededAverageQuantity: Number(neededAverageQuantity),
        companyName,
        category
      });

      setSuccess(`Steel product ${saved.itemId} was cataloged in Central Registry.`);
      
      // Cleanup inputs
      setItemId('');
      setItemName('');
      setAnnualQuantity('');
      setNeededAverageQuantity('');
      
      // Refresh parent state
      onMutationSuccess();
      
      setTimeout(() => {
        setSuccess(null);
      }, 4000);
    } catch (err: any) {
      setError("Database storage error. Please check your storage settings.");
    }
  };

  const getStockStatusStyle = (leftover: number, avgNeeded: number) => {
    const ratio = leftover / avgNeeded;
    if (ratio === 0) return { bg: 'bg-red-100 text-red-800 border-red-200', text: 'Out of Stock', color: 'text-red-600' };
    if (ratio < 0.5) return { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'Low Stock (<50%)', color: 'text-amber-600' };
    return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'Healthy Stock', color: 'text-emerald-600' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="tab-item-entry-root">
      
      {/* Registration Form (Left Column) */}
      <div className="lg:col-span-1" id="item-entry-form-column">
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 relative overflow-hidden" id="entry-form-card">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#002d62]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ff8c00]" />
          
          <div className="flex items-center gap-2.5 mb-5" id="form-header">
            <PlusCircle className="w-5 h-5 text-[#002d62]" />
            <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
              Catalog Steel Product
            </h3>
          </div>

          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-600 text-rose-900 px-3 py-2 rounded-none text-xs mb-4 flex items-start gap-1.5 font-sans" id="entry-error">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 px-3 py-2 rounded-none text-xs mb-4 flex items-start gap-1.5 font-sans" id="entry-success">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="item-registration-form">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Technical Unique Item ID
              </label>
              <input 
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                placeholder="e.g. SAIL-HR-405, SAIL-TMT-12"
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all uppercase"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1 font-sans">Unique standard steel specification code.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Commercial Product Description
              </label>
              <input 
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Hot Rolled Tension Coil 2.5mm"
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-sans"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Product Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2 py-2 text-xs focus:outline-none focus:border-[#ff8c00] transition-all"
                >
                  <option value="Plates">Heavy Plates</option>
                  <option value="Coils">Hot/Cold Coils</option>
                  <option value="Rebars">Structural Rebars</option>
                  <option value="Beams / Structurals">I-Beams / Angles</option>
                  <option value="Sheets">Safety Sheets</option>
                  <option value="Semis">Ingots / Billets</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  SAIL Manufacturer Unit
                </label>
                <select
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2 py-2 text-xs focus:outline-none focus:border-[#ff8c00] transition-all"
                >
                  <option value="SAIL Bokaro Steel Plant (BSL)">Bokaro (BSL)</option>
                  <option value="SAIL Bhilai Steel Plant (BSP)">Bhilai (BSP)</option>
                  <option value="SAIL Rourkela Steel Plant (RSP)">Rourkela (RSP)</option>
                  <option value="SAIL Durgapur Steel Plant (DSP)">Durgapur (DSP)</option>
                  <option value="SAIL IISCO Steel Plant (ISP)">IISCO (ISP)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Allocated Annual Consumption (Metric Tons)
              </label>
              <input 
                type="number"
                value={annualQuantity}
                onChange={(e) => setAnnualQuantity(e.target.value !== '' ? Number(e.target.value) : '')}
                placeholder="e.g. 5000"
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1 font-sans">Expected annual departmental allocation.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Store Buffer Stock Level Needed (MT)
              </label>
              <input 
                type="number"
                value={neededAverageQuantity}
                onChange={(e) => setNeededAverageQuantity(e.target.value !== '' ? Number(e.target.value) : '')}
                placeholder="e.g. 400"
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1 font-sans">Average safety threshold needed in hand.</p>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#002d62] hover:bg-[#00224b] text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-widest border-b-4 border-[#ff8c00] transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ff8c00] cursor-pointer mt-2"
              id="btn-register-submit"
            >
              <PlusCircle className="w-4 h-4 text-[#ff8c00]" />
              Register Item In DB
            </button>
          </form>
        </div>
      </div>

      {/* Real-time Tracking table for admin oversight (Right 2 Columns) */}
      <div className="lg:col-span-2 flex flex-col h-full" id="item-tracking-table-column">
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 flex flex-col flex-1 relative overflow-hidden" id="tracking-table-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 mt-1" id="table-controls-row">
            <div className="flex items-center gap-2.5" id="table-title">
              <ClipboardList className="w-5 h-5 text-[#002d62]" />
              <div>
                <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
                  Real-Time Tracking Registry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Admin administrative oversight on cataloged items and active balances.</p>
              </div>
            </div>
            
            <div className="text-right" id="table-totals">
              <span className="inline-flex items-center px-2.5 py-1 rounded-none text-xs font-bold bg-[#f8fafc] text-[#002d62] border border-slate-200" id="total-badge">
                Registered Count: {items.length} Products
              </span>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto border border-slate-200 rounded-none flex-1" id="items-table-wrapper">
            <table className="min-w-full divide-y divide-slate-200 text-left" id="items-oversight-table">
              <thead>
                <tr className="bg-slate-50" id="table-th-row">
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Item Details</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Manufacturer / Yard</th>
                  <th scope="col" className="px-4 py-3.5 text-right text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Annual Predicted</th>
                  <th scope="col" className="px-4 py-3.5 text-right text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Safety Buffer</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Leftover Stock</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Balance Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white" id="table-tb-body">
                {items.length === 0 ? (
                  <tr id="empty-row">
                    <td colSpan={6} className="px-4 py-12 text-center text-sm font-medium text-slate-400" id="td-empty">
                      No steel products registered in active memory. Please fill the left form to catalog.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const status = getStockStatusStyle(item.leftoverStock, item.neededAverageQuantity);
                    const percentOfNeeded = Math.min(100, Math.round((item.leftoverStock / item.neededAverageQuantity) * 100));

                    return (
                      <tr key={item.itemId} className="hover:bg-[#f8fafc] transition-colors" id={`row-${item.itemId}`}>
                        
                        {/* ID and info */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#002d62] font-mono tracking-tight uppercase">{item.itemId}</span>
                            <span className="text-xs font-medium text-slate-700 mt-1 max-w-xs truncate" title={item.itemName}>{item.itemName}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-600 rounded-none px-1.5 py-0.5 inline-block w-fit mt-1 font-semibold border border-slate-200/50">{item.category}</span>
                          </div>
                        </td>

                        {/* Manufacturer */}
                        <td className="px-4 py-3.5 text-xs text-slate-600 font-sans font-medium">
                          {item.companyName.replace('SAIL', '').trim()}
                        </td>

                        {/* Annual projected */}
                        <td className="px-4 py-3.5 text-right text-xs font-mono font-bold text-slate-800">
                          {item.annualQuantity.toLocaleString('en-IN')} MT
                        </td>

                        {/* Safety Buffer */}
                        <td className="px-4 py-3.5 text-right text-xs font-mono font-bold text-slate-800">
                          {item.neededAverageQuantity.toLocaleString('en-IN')} MT
                        </td>

                        {/* Leftover stock */}
                        <td className="px-4 py-3.5 text-center font-sans">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-mono font-bold text-slate-900">{item.leftoverStock} MT</span>
                            {/* Stock visual thermometer bar */}
                            <div className="w-16 h-1.5 bg-slate-100 rounded-none overflow-hidden mt-1.5 border border-slate-200/50">
                              <div 
                                className={`h-full rounded-none ${
                                  percentOfNeeded === 0 
                                    ? 'bg-rose-500' 
                                    : percentOfNeeded < 50 
                                      ? 'bg-amber-500' 
                                      : 'bg-emerald-500'
                                }`}
                                style={{ width: `${percentOfNeeded}%` }}
                              />
                            </div>
                            <span className="text-[8px] text-slate-400 font-semibold mt-0.5 font-mono">{percentOfNeeded}% Buffer</span>
                          </div>
                        </td>

                        {/* Status Label */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-none border ${status.bg}`}>
                            {status.text}
                          </span>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
