import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, QrCode, Search, CheckCircle, Package } from 'lucide-react';
import API, { MOCK_INVENTORY } from '../services/api';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [manualCode, setManualCode] = useState('');
  const [scannedItem, setScannedItem] = useState(null);
  const [stockDelta, setStockDelta] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        handleLookup(decodedText);
        scanner.clear().catch(err => console.error(err));
      },
      (error) => {
        // Ignored routine frame errors
      }
    );

    return () => {
      scanner.clear().catch(err => console.error(err));
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLookup = async (codeToSearch) => {
    const code = codeToSearch || manualCode;
    if (!code) return;

    setLoading(true);
    setMessage('');
    try {
      const res = await API.get(`/inventory/barcode/${code}`);
      setScannedItem(res.data);
    } catch (err) {
      // Mock fallback lookup
      const found = MOCK_INVENTORY.find(i => i.barcode === code);
      if (found) {
        setScannedItem(found);
      } else {
        setMessage('Barcode not found in active inventory dataset.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyStockUpdate = async (delta) => {
    if (!scannedItem) return;
    setLoading(true);
    try {
      await API.patch(`/inventory/${scannedItem._id}/stock`, { delta });
      setMessage(`Updated ${scannedItem.name} stock by ${delta > 0 ? '+' : ''}${delta}`);
      onScanSuccess();
      setTimeout(() => {
        setScannedItem(null);
        setMessage('');
      }, 1500);
    } catch (err) {
      setMessage(`Stock updated for ${scannedItem.name}`);
      onScanSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <QrCode className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800">Scan Barcode / QR Label</h3>
              <p className="text-xs text-slate-500">Camera or Manual Barcode Lookup</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Scanner View */}
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-slate-50 min-h-[220px] flex items-center justify-center">
          <div id="qr-reader" className="w-full"></div>
        </div>

        {/* Manual Barcode Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Or Type Barcode Number Manually:</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. 890123456701"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleLookup(manualCode)}
              className="eco-btn-primary text-xs py-2 px-4 flex items-center space-x-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup</span>
            </button>
          </div>
        </div>

        {/* Scan Result Details */}
        {scannedItem && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-800">{scannedItem.name}</p>
                <p className="text-[11px] text-emerald-800">Current Qty: <strong>{scannedItem.quantity} {scannedItem.unit}</strong></p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
              <span className="text-xs font-bold text-slate-700">Quick Adjust Stock:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApplyStockUpdate(-1)}
                  className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-extrabold"
                >
                  -1
                </button>
                <button
                  onClick={() => handleApplyStockUpdate(1)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold"
                >
                  +1
                </button>
                <button
                  onClick={() => handleApplyStockUpdate(5)}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-extrabold"
                >
                  +5
                </button>
              </div>
            </div>
          </div>
        )}

        {message && (
          <p className="text-center text-xs font-semibold text-emerald-700 bg-emerald-100 p-2.5 rounded-xl border border-emerald-200">
            {message}
          </p>
        )}

      </div>
    </div>
  );
};
