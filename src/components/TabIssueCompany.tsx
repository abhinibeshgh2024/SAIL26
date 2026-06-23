import React, { useState } from 'react';
import { SteelItem, IssueSales, User } from '../types';
import { addIssue } from '../utils/db';
import { exportToExcel, exportToPDF } from '../utils/export';
import { ShoppingCart, Clipboard, FileSpreadsheet, FileText, Search, CreditCard, Landmark, Check } from 'lucide-react';

interface TabIssueCompanyProps {
  items: SteelItem[];
  issues: IssueSales[];
  currentUser: User;
  onMutationSuccess: () => void;
}

export const TabIssueCompany: React.FC<TabIssueCompanyProps> = ({ 
  items, 
  issues, 
  currentUser, 
  onMutationSuccess 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [buyerFirm, setBuyerFirm] = useState('');
  const [issuedQuantity, setIssuedQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('64000'); // default realistic price in INR/MT
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

  // feedback indicators
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  // Filter items matching search queries
  const matchedSteelItems = searchQuery.trim() === ''
    ? items.filter(i => i.leftoverStock > 0) // prioritize items in stock
    : items.filter(i => 
        i.itemId.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const selectedItem = items.find(i => i.itemId === selectedItemId);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (!selectedItemId) {
      setErrorText("Please select a valid registered steel product first.");
      return;
    }

    if (!buyerFirm) {
      setErrorText("Please state the buyer company or logistics firm name.");
      return;
    }

    if (!issuedQuantity || Number(issuedQuantity) <= 0) {
      setErrorText(" Tonnage issued quantity must be a positive numeric value.");
      return;
    }

    if (!unitPrice || Number(unitPrice) <= 0) {
      setErrorText("Unit price must be a valid positive amount.");
      return;
    }

    if (selectedItem && Number(issuedQuantity) > selectedItem.leftoverStock) {
      setErrorText(`Stock Out of Bound: The current leftover balance in warehouse is only ${selectedItem.leftoverStock} MT. Cannot issue ${issuedQuantity} MT.`);
      return;
    }

    try {
      addIssue({
        itemId: selectedItemId,
        itemName: selectedItem!.itemName,
        buyerFirm: buyerFirm.trim(),
        issuedQuantity: Number(issuedQuantity),
        unitPrice: Number(unitPrice),
        issueDate,
        issuedByName: currentUser.fullName
      });

      setSuccessText(`Outward dispatch logged for ${selectedItemId} issued to ${buyerFirm.trim()}.`);
      
      // Reset fields
      setBuyerFirm('');
      setIssuedQuantity('');
      setSelectedItemId('');
      onMutationSuccess(); // refresh parent state

      setTimeout(() => {
        setSuccessText(null);
      }, 4500);

    } catch (err) {
      setErrorText("Critical storage dispatch write failed. Try again.");
    }
  };

  const formatRUPEE = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExportExcelHistory = () => {
    if (issues.length === 0) return;

    const headers = [
      'Transaction Reference',
      'Steel Item ID',
      'Commercial Description',
      'Procurement Client Firm',
      'Issued Quantity (MT)',
      'Contract Unit Price (INR/MT)',
      'Total Net Transaction (INR)',
      'Dispatch Logging Date',
      'Authorizing Store Officer'
    ];

    const rows = issues.map(iss => [
      iss.issueId,
      iss.itemId,
      iss.itemName,
      iss.buyerFirm,
      iss.issuedQuantity,
      iss.unitPrice,
      iss.totalAmount,
      iss.issueDate,
      iss.issuedByName
    ]);

    exportToExcel(headers, rows, `SAIL_Issue_Ledger_Audit_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDFHistory = () => {
    if (issues.length === 0) return;

    const headers = ['Ref ID', 'Material ID', 'Client Procurement Firm', 'Issued Stock', 'Unit Price', 'Transaction Value'];
    const rows = issues.map(iss => [
      iss.issueId,
      iss.itemId,
      iss.buyerFirm,
      `${iss.issuedQuantity} MT`,
      formatRUPEE(iss.unitPrice),
      formatRUPEE(iss.totalAmount)
    ]);

    const metadata = [
      { label: 'Document Classification', value: 'COMMERCIAL STORES SALE DISPATCH' },
      { label: 'Registry Scope', value: 'Outward Issuance History Ledger' },
      { label: 'Exported Tonnage Transactions', value: `${issues.length} Dispatch Logs` },
      { label: 'Authorized Auditor', value: currentUser.fullName }
    ];

    exportToPDF('SAIL COMMERICAL OUTWARD DISPATCH LEDGER', headers, rows, metadata);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="tab-issue-company-root">
      
      {/* Registration dispatch Form (Column 1) */}
      <div className="lg:col-span-1" id="issue-form-card-column">
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 relative overflow-hidden" id="issue-form-card">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ff8c00]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
          
          <div className="flex items-center gap-2.5 mb-5" id="issue-form-header">
            <ShoppingCart className="w-5 h-5 text-[#002d62]" />
            <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
              Log Outward Issue (Selling)
            </h3>
          </div>

          {errorText && (
            <div className="bg-rose-50 border-l-4 border-rose-600 text-rose-900 px-3 py-2 rounded-none text-xs mb-4 flex items-start gap-1.5 font-sans" id="issue-error">
              <span>{errorText}</span>
            </div>
          )}

          {successText && (
            <div className="bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 px-3 py-2 rounded-none text-xs mb-4 flex items-start gap-1.5 font-sans" id="issue-success">
              <span>{successText}</span>
            </div>
          )}

          <form onSubmit={handleIssueSubmit} className="space-y-4" id="issue-form">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Search Warehouse Inventory
              </label>
              <div className="relative mb-2">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type ID / name to fetch balance..."
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#ff8c00] transition-all font-sans"
                />
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Selector dropdown */}
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2.5 py-2 text-xs font-sans font-bold focus:outline-none focus:border-[#ff8c00] transition-all"
                required
              >
                <option value="">-- Choose Steel Material --</option>
                {matchedSteelItems.map(item => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.itemId} - {item.itemName} (Balance: {item.leftoverStock} MT)
                  </option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div className="bg-slate-50 p-3 rounded-none border border-slate-200 space-y-1.5 font-sans" id="issue-item-live-status">
                <div className="flex justify-between text-[11px]" id="live-stock-level">
                  <span className="text-slate-500 font-medium">Warehouse leftover balance:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedItem.leftoverStock} MT</span>
                </div>
                <div className="flex justify-between text-[11px]" id="live-category-level">
                  <span className="text-slate-500 font-medium">Industry Segment:</span>
                  <span className="font-bold text-[#002d62] uppercase tracking-wider">{selectedItem.category}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                Buyer Company / Client Firm
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={buyerFirm}
                  onChange={(e) => setBuyerFirm(e.target.value)}
                  placeholder="e.g. Larsen &amp; Toubro Ltd."
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-3 py-2 text-xs focus:outline-none focus:border-[#ff8c00] transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Issued Quantity (MT)
                </label>
                <input 
                  type="number"
                  value={issuedQuantity}
                  onChange={(e) => setIssuedQuantity(e.target.value !== '' ? Number(e.target.value) : '')}
                  placeholder="Tons to sell"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2.5 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#ff8c00] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Rate Per Ton (INR)
                </label>
                <input 
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value !== '' ? Number(e.target.value) : '')}
                  placeholder="Rate ₹"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2.5 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#ff8c00] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                Date of Dispatch Bill
              </label>
              <input 
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-[#ff8c00] transition-all"
                required
              />
            </div>

            {issuedQuantity && unitPrice && (
              <div className="bg-slate-50 p-3 rounded-none border border-slate-200 text-center flex flex-col items-center justify-center italic" id="issue-total-preview animate-none">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estimated Tender Contract Value</span>
                <strong className="text-base font-mono font-black text-[#002d62] mt-1">
                  {formatRUPEE(Number(issuedQuantity) * Number(unitPrice))}
                </strong>
                <span className="text-[9px] text-slate-500 font-semibold mt-0.5">({issuedQuantity} Tons &times; {formatRUPEE(Number(unitPrice))}/MT)</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#002d62] hover:bg-[#00224b] text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-widest border-b-4 border-[#ff8c00] transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ff8c00] cursor-pointer mt-2"
              id="btn-issue-submit"
            >
              <Check className="w-4 h-4 text-[#ff8c00]" />
              Commit Outward Dispatch
            </button>
          </form>

        </div>
      </div>

      {/* History of issuing & dispatch log ledger (Columns 2 & 3) */}
      <div className="lg:col-span-2 flex flex-col h-full" id="issue-history-column">
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 flex flex-col flex-1 relative overflow-hidden" id="issue-history-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5" id="issue-history-hdr-row">
            <div className="flex items-center gap-2.5 mt-1" id="issue-logs-title">
              <Clipboard className="w-5 h-5 text-[#002d62]" />
              <div>
                <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
                  Outgoing Sales Ledger
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Authoritative historical registry of warehouse issue logs and client receipts.</p>
              </div>
            </div>

            {/* Exporting actions buttons */}
            <div className="flex items-center gap-2" id="export-buttons-group">
              <button
                onClick={handleExportPDFHistory}
                disabled={issues.length === 0}
                className="flex items-center gap-1.5 bg-[#002d62] hover:bg-[#00224b] disabled:opacity-40 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 border-b-2 border-[#ff8c00] rounded-none transition-all cursor-pointer"
                id="btn-issue-history-pdf"
              >
                <FileText className="w-3.5 h-3.5 text-[#ff8c00]" />
                Export PDF
              </button>
              <button
                onClick={handleExportExcelHistory}
                disabled={issues.length === 0}
                className="flex items-center gap-1.5 bg-[#002d62] hover:bg-[#00224b] disabled:opacity-40 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 border-b-2 border-[#ff8c00] rounded-none transition-all cursor-pointer"
                id="btn-issue-history-excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#ff8c00]" />
                Export Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-none flex-1 overflow-y-auto max-h-[500px]" id="issues-table-scroll-wrapper">
            <table className="min-w-full divide-y divide-slate-200 text-left" id="issue-sales-history-table">
              <thead>
                <tr className="bg-slate-50" id="issue-th-row">
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Issue reference</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Buyer company</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Issued Material</th>
                  <th scope="col" className="px-4 py-3.5 text-right text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Weight / Rate</th>
                  <th scope="col" className="px-4 py-3.5 text-right text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Contract Total</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white" id="issue-tb-body">
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm font-medium text-slate-400">
                      No outgoing transaction records cataloged in history.
                    </td>
                  </tr>
                ) : (
                  issues.map(iss => (
                    <tr key={iss.issueId} className="hover:bg-[#f8fafc] transition-colors" id={`issue-row-${iss.issueId}`}>
                      
                      {/* Ticket Ref */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-[#002d62]">{iss.issueId}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 mt-0.5">{iss.issueDate}</span>
                        </div>
                      </td>

                      {/* Buyer Firm */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col max-w-[150px]">
                          <span className="text-xs font-bold text-slate-800 truncate" title={iss.buyerFirm}>
                            {iss.buyerFirm}
                          </span>
                        </div>
                      </td>

                      {/* Material Spec */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col max-w-[180px]">
                          <span className="text-xs font-bold font-mono text-[#002d62] leading-none">{iss.itemId}</span>
                          <span className="text-[10px] text-slate-500 mt-1 truncate font-sans" title={iss.itemName}>{iss.itemName}</span>
                        </div>
                      </td>

                      {/* Weight and Rate */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col font-mono text-xs">
                          <span className="font-bold text-slate-800">{iss.issuedQuantity} MT</span>
                          <span className="text-[9px] text-slate-400">{formatRUPEE(iss.unitPrice)}/MT</span>
                        </div>
                      </td>

                      {/* Contract Value */}
                      <td className="px-4 py-4 text-right text-xs font-mono font-bold text-[#002d62]">
                        {formatRUPEE(iss.totalAmount)}
                      </td>

                      {/* Authorized Employee */}
                      <td className="px-4 py-4 text-center text-xs font-semibold text-slate-600 block sm:table-cell font-sans">
                        {iss.issuedByName}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
};
