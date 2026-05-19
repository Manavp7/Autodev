import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import GlobalDetailModal from './components/layout/GlobalDetailModal';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SupplierManagement from './pages/SupplierManagement';
import PurchaseRequisitions from './pages/PurchaseRequisitions';
import RFQManagement from './pages/RFQManagement';
import PurchaseOrders from './pages/PurchaseOrders';
import GoodsReceipt from './pages/GoodsReceipt';
import SupplierPerformance from './pages/SupplierPerformance';
import ShortageManagement from './pages/ShortageManagement';
import ContractManagement from './pages/ContractManagement';

function AppContent() {
  const { user } = useApp();

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <GlobalDetailModal />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="suppliers" element={<SupplierManagement />} />
          <Route path="prs" element={<PurchaseRequisitions />} />
          <Route path="rfqs" element={<RFQManagement />} />
          <Route path="pos" element={<PurchaseOrders />} />
          <Route path="grn" element={<GoodsReceipt />} />
          <Route path="performance" element={<SupplierPerformance />} />
          <Route path="shortages" element={<ShortageManagement />} />
          <Route path="contracts" element={<ContractManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
