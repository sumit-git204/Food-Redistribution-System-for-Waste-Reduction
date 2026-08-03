import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { InventoryPage } from './pages/InventoryPage';
import { TaxonomyPage } from './pages/TaxonomyPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { QRScannerModal } from './components/QRScannerModal';
import { CSVUploadModal } from './components/CSVUploadModal';

const ProtectedLayout = () => {
  const { user } = useAuth();
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/30">
      <Navbar
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        alertCount={3}
      />
      
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 py-6 gap-6">
        <Sidebar />
        
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard key={refreshKey} onQuickStockUpdate={triggerRefresh} />} />
            <Route
              path="/inventory"
              element={
                <InventoryPage
                  key={refreshKey}
                  onOpenQRScanner={() => setIsQRScannerOpen(true)}
                  onOpenCSVModal={() => setIsCSVModalOpen(true)}
                />
              }
            />
            <Route path="/alerts" element={<Dashboard key={refreshKey + '_alerts'} onQuickStockUpdate={triggerRefresh} />} />
            <Route path="/taxonomy" element={<TaxonomyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Shared Modals */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={triggerRefresh}
      />
      
      <CSVUploadModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onUploadSuccess={triggerRefresh}
      />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
