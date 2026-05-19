import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import GlobalDetailModal from './components/layout/GlobalDetailModal'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SupplierManagement from './pages/SupplierManagement'
import PurchaseRequisitions from './pages/PurchaseRequisitions'
import RFQManagement from './pages/RFQManagement'
import PurchaseOrders from './pages/PurchaseOrders'
import GoodsReceipt from './pages/GoodsReceipt'
import SupplierPerformance from './pages/SupplierPerformance'
import ShortageManagement from './pages/ShortageManagement'
import ContractManagement from './pages/ContractManagement'

function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

function NotFound() {
  return (
    <div className="p-12 text-center text-text-secondary">
      <h1 className="text-3xl font-black text-text-primary mb-2">404</h1>
      <p>That route does not exist in AutoSCM.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <GlobalDetailModal />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"   element={<Dashboard />} />
              <Route path="suppliers"   element={<SupplierManagement />} />
              <Route path="prs"         element={<PurchaseRequisitions />} />
              <Route path="rfqs"        element={<RFQManagement />} />
              <Route path="pos"         element={<PurchaseOrders />} />
              <Route path="grn"         element={<GoodsReceipt />} />
              <Route path="performance" element={<SupplierPerformance />} />
              <Route path="shortages"   element={<ShortageManagement />} />
              <Route path="contracts"   element={<ContractManagement />} />
              <Route path="*"           element={<NotFound />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
