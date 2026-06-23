import React, { useState, useRef } from 'react';
import { SteelItem, RefillOrder } from '../types';
import { addOrder } from '../utils/db';
import { Calendar, Image as ImageIcon, PlusCircle, Search, Trash2, Clipboard, ExternalLink, Paperclip, Eye } from 'lucide-react';

interface TabRefillProps {
  items: SteelItem[];
  orders: RefillOrder[];
  onMutationSuccess: () => void;
}

export const TabRefill: React.FC<TabRefillProps> = ({ items, orders, onMutationSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [receivingDate, setReceivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [receivedQuantity, setReceivedQuantity] = useState<number | ''>('');
  const [supplierName, setSupplierName] = useState('SAIL Bhilai Steel Plant (BSP)');
  
  // Multiple images as base64 strings
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Image viewer modal states
  const [viewerImage, setViewerImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter items matching search for easy search-selection
  const matchedSearchItems = searchQuery.trim() === '' 
    ? items.filter(i => i.leftoverStock < i.neededAverageQuantity) // priority to low stock
    : items.filter(i => 
        i.itemId.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setErrorMsg(null);
    const loadedImages: string[] = [];

    Array.from(files).forEach((file: any) => {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setErrorMsg("Only valid bill images (JPEG/PNG/SVG) are permitted as proof.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedItemId) {
      setErrorMsg("Please select a registered steel product catalog ID.");
      return;
    }

    if (!receivedQuantity || Number(receivedQuantity) <= 0) {
      setErrorMsg("Please specify a positive recibido tonnage quantity.");
      return;
    }

    if (new Date(receivingDate) < new Date(orderDate)) {
      setErrorMsg("Schedule Conflict: Receiving date cannot precede order date.");
      return;
    }

    const selectedItem = items.find(i => i.itemId === selectedItemId);
    if (!selectedItem) {
      setErrorMsg("Steel product template lookup failed. Please select from list.");
      return;
    }

    try {
      addOrder({
        itemId: selectedItem.itemId,
        itemName: selectedItem.itemName,
        receivingDate,
        orderDate,
        receivedQuantity: Number(receivedQuantity),
        supplierName,
        receiptImages: images.length > 0 ? images : ["data:image/svg+xml;utf8,<svg width='200' height='100' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='%23ccc'/><text x='10' y='50'>Bill proof omitted</text></svg>"]
      });

      setSuccessMsg(`Inward ledger order documented successfully for ${selectedItem.itemId}. Stocks updated.`);
      
      // Cleanup inputs
      setReceivedQuantity('');
      setImages([]);
      setSelectedItemId('');
      onMutationSuccess(); // Trigger reload
      
      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: any) {
      setErrorMsg("Error committing data to stores. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="tab-refill-root">
      
      {/* Refill form (Left Column) */}
      <div className="lg:col-span-1" id="refill-form-col">
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 relative overflow-hidden" id="refill-card-frame">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#002d62]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ff8c00]" />
          
          <div className="flex items-center gap-2.5 mb-5" id="refill-hdr">
            <PlusCircle className="w-5 h-5 text-[#002d62]" />
            <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
              Inward Dispatch Refill
            </h3>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border-l-4 border-rose-600 text-rose-900 px-3 py-2 rounded-none text-xs mb-4 flex items-start gap-1.5 font-sans" id="refill-error">
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 px-3 py-2 rounded-none text-xs mb-4 flex items-start gap-1.5 font-sans" id="refill-success">
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRefillSubmit} className="space-y-4" id="refill-form">
            
            {/* Search in-form autocomplete search input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Search Low-Stock product in yard
              </label>
              <div className="relative mb-2">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type ID or material descriptor..."
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#ff8c00] transition-all font-sans"
                />
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Selector dropdown */}
              <select
                value={selectedItemId}
                onChange={(e) => {
                  setSelectedItemId(e.target.value);
                  const selectedItemInYards = items.find(i => i.itemId === e.target.value);
                  if (selectedItemInYards) {
                    setSupplierName(selectedItemInYards.companyName);
                  }
                }}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2.5 py-2 text-xs font-sans font-semibold focus:outline-none focus:border-[#ff8c00] transition-all"
                required
              >
                <option value="">-- Choose Product From Filtered Search --</option>
                {matchedSearchItems.map(item => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.itemId} - {item.itemName} ({item.leftoverStock} MT left)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Date of Dispatch Order
                </label>
                <input 
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-[#ff8c00] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Date of Gate Receiving
                </label>
                <input 
                  type="date"
                  value={receivingDate}
                  onChange={(e) => setReceivingDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-[#ff8c00] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Refilled Net Weight (Metric Tons)
              </label>
              <input 
                type="number"
                value={receivedQuantity}
                onChange={(e) => setReceivedQuantity(e.target.value !== '' ? Number(e.target.value) : '')}
                placeholder="e.g. 250"
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all"
                required
              />
            </div>

            {/* Bill image proof adder */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Inward bill image proofs (multiple)
              </label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#ff8c00] rounded-none p-4 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-center"
                id="image-drop-area"
              >
                <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-600">Select Bill Images/Receipts</span>
                <span className="text-[8px] text-slate-400 mt-0.5">Drag-and-drop or select JPG/PNG files</span>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden" 
                  multiple 
                  accept="image/*"
                />
              </div>

              {/* Added Image Thumbnails List */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3" id="added-thumbnails-grid">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group border border-slate-200 rounded-none overflow-hidden aspect-video bg-slate-100" id={`thumbnail-${idx}`}>
                      <img src={img} alt="bill proof" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewerImage(img)}
                          className="p-1 bg-white/20 hover:bg-white/40 text-white rounded-none text-[10px] cursor-pointer"
                          title="View image"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-none text-[10px] cursor-pointer"
                          title="Delete image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#002d62] hover:bg-[#00224b] text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-widest border-b-4 border-[#ff8c00] transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ff8c00] cursor-pointer mt-2"
              id="btn-refill-submit"
            >
              <PlusCircle className="w-4 h-4 text-[#ff8c00]" />
              Commit Inward Refill
            </button>
          </form>

        </div>
      </div>

      {/* Historical logs of orders (Right 2 Columns) */}
      <div className="lg:col-span-2 flex flex-col h-full" id="history-logs-col">
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 flex flex-col flex-1 relative overflow-hidden" id="history-logs-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#002d62]" />
          
          <div className="flex items-center gap-2.5 mb-5 mt-1" id="logs-hdr">
            <Clipboard className="w-5 h-5 text-[#002d62]" />
            <div>
              <h3 className="text-sm font-bold text-[#002d62] uppercase tracking-wider">
                Receiving Ledger History
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-sans">Historical verification records of inward yard gate shipments.</p>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 max-h-[500px] border border-slate-200 rounded-none" id="logs-scrollbar">
            <table className="min-w-full divide-y divide-slate-200 text-left" id="refill-history-table">
              <thead>
                <tr className="bg-slate-50" id="logs-th-row">
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Refill Reference</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Product Info</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Date Schedule</th>
                  <th scope="col" className="px-4 py-3.5 text-right text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Received Tonnage</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-bold text-[#002d62] uppercase tracking-widest border-b border-slate-200">Bills &amp; Paperwork</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white" id="logs-tb-body">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm font-medium text-slate-400">
                      No receiving logs available inside standard memory.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.orderId} className="hover:bg-[#f8fafc] transition-colors" id={`order-row-${order.orderId}`}>
                      
                      {/* Order Reference ID */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-[#002d62] tracking-tight">{order.orderId}</span>
                          <span className="text-[9px] text-slate-500 font-semibold block mt-1 font-sans">{order.supplierName.replace('SAIL', '').trim()}</span>
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col max-w-xs">
                          <span className="text-xs font-bold text-[#002d62] font-mono tracking-tight uppercase leading-none">{order.itemId}</span>
                          <span className="text-xs text-slate-600 mt-1 truncate" title={order.itemName}>{order.itemName}</span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-4 py-4 text-xs font-mono text-slate-600">
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400">Ordered: {order.orderDate}</span>
                          <span className="text-emerald-700 font-bold">Received: {order.receivingDate}</span>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-4 text-right text-xs font-mono font-bold text-slate-900">
                        +{order.receivedQuantity.toLocaleString('en-IN')} MT
                      </td>

                      {/* Document proofs attachment view */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5" id={`attachments-${order.orderId}`}>
                          {order.receiptImages && order.receiptImages.map((src, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setViewerImage(src)}
                              className="w-7 h-7 rounded-none border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                              title={`View receipt attachment ${i + 1}`}
                            >
                              <Paperclip className="w-3.5 h-3.5 text-[#002d62] hover:text-[#ff8c00]" />
                            </button>
                          ))}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Pop-up Image Viewer lightbox Modal */}
      {viewerImage && (
        <div 
          onClick={() => setViewerImage(null)}
          className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4" 
          id="lightbox-backdrop"
        >
          <div className="bg-white border border-slate-300 rounded-none overflow-hidden max-w-2xl w-full shadow-2xl relative p-4 text-center" id="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <img src={viewerImage} alt="Verifying Bill Proof" className="max-w-full max-h-[70vh] mx-auto object-contain rounded-none border border-slate-200" />
            <div className="flex justify-between items-center mt-4 px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SAIL Gate Inward document verify window</span>
              <button
                onClick={() => setViewerImage(null)}
                className="bg-[#002d62] hover:bg-[#00224b] text-white font-bold text-xs px-4 py-2 rounded-none border-b-2 border-b-[#ff8c00] cursor-pointer"
                id="btn-close-lightbox"
              >
                Close verification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
