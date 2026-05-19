import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SearchPage from './pages/SearchPage'
import RequireAuth from './components/auth/RequireAuth'
import RoleGuard from './components/auth/RoleGuard'

// DEV pages
import Dashboard from './pages/Dashboard'
import ProgramPortfolio from './pages/ProgramPortfolio'
import CreateProgramWizard from './pages/CreateProgramWizard'
import Gate0Review from './pages/Gate0Review'
import ProgramTimeline from './pages/ProgramTimeline'
import BOMHub from './pages/BOMHub'
import EngineeringChange from './pages/EngineeringChange'
import DVPR from './pages/DVPR'
import APQPTracker from './pages/APQPTracker'
import GateApprovalsHub from './pages/GateApprovalsHub'
import DocumentLibrary from './pages/DocumentLibrary'
import PrototypeBuildAndTest from './pages/PrototypeBuildAndTest'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import MyTasks from './pages/MyTasks'
import NotificationCenter from './pages/NotificationCenter'
import IntegrationHub from './pages/IntegrationHub'
import UserManagement from './pages/UserManagement'
import ProfileCenter from './pages/ProfileCenter'
import HelpCenter from './pages/HelpCenter'

// MFG pages (sub-app rendered inside the unified shell)
import { PlanningPage } from './mfg/pages/PlanningPage'
import { OperationsDashboardPage } from './mfg/pages/OperationsDashboardPage'
import { WorkOrderManagementPage } from './mfg/pages/WorkOrderManagementPage'
import { TaktTimePage } from './mfg/pages/TaktTimePage'
import { AndonManagementPage } from './mfg/pages/AndonManagementPage'
import { LiveAssemblyFeedPage } from './mfg/pages/LiveAssemblyFeedPage'
import { ShiftHandoverPage } from './mfg/pages/ShiftHandoverPage'
import { OeeAnalyticsPage } from './mfg/pages/OeeAnalyticsPage'
import { SystemAlertsPage } from './mfg/pages/SystemAlertsPage'
import { MachineBreakdownPage } from './mfg/pages/MachineBreakdownPage'
import { ToolingEquipmentPage } from './mfg/pages/ToolingEquipmentPage'
import { MachineRegistryPage } from './mfg/pages/MachineRegistryPage'
import { SparePartsInventoryPage } from './mfg/pages/SparePartsInventoryPage'
import { ProductionQualityGatePage } from './mfg/pages/ProductionQualityGatePage'
import { ScrapReworkPage } from './mfg/pages/ScrapReworkPage'
import { EolTestingPage } from './mfg/pages/EolTestingPage'
import { VinTraceabilityPage } from './mfg/pages/VinTraceabilityPage'
import { ReportsAnalyticsPage } from './mfg/pages/ReportsAnalyticsPage'
import { UserRoleManagementPage } from './mfg/pages/UserRoleManagementPage'
import { SystemConfigPage } from './mfg/pages/SystemConfigPage'
import { HelpSupportPage } from './mfg/pages/HelpSupportPage'

// SCM pages
import SCMDashboard from './scm/pages/Dashboard'
import SupplierManagement from './scm/pages/SupplierManagement'
import PurchaseRequisitions from './scm/pages/PurchaseRequisitions'
import RFQManagement from './scm/pages/RFQManagement'
import PurchaseOrders from './scm/pages/PurchaseOrders'
import GoodsReceipt from './scm/pages/GoodsReceipt'
import SupplierPerformance from './scm/pages/SupplierPerformance'
import ShortageManagement from './scm/pages/ShortageManagement'
import ContractManagement from './scm/pages/ContractManagement'

import GlobalDetailModal from './scm/components/layout/GlobalDetailModal'
import { AppProvider as ScmAppProvider } from './scm/context/AppContext'

function ScmRouteWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ScmAppProvider>
      <GlobalDetailModal />
      {children}
    </ScmAppProvider>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* DEV */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="programs" element={<ProgramPortfolio />} />
            <Route
              path="programs/new"
              element={
                <RoleGuard roles={['CHIEF_ENGINEER', 'PROGRAM_MANAGER']}>
                  <CreateProgramWizard />
                </RoleGuard>
              }
            />
            <Route path="programs/:id/gate/:gate" element={<Gate0Review />} />
            <Route path="programs/:id/gate/0" element={<Gate0Review />} />
            <Route path="programs/:id/timeline" element={<ProgramTimeline />} />
            <Route path="bom" element={<BOMHub />} />
            <Route path="bom/:programId" element={<BOMHub />} />
            <Route path="engineering-change" element={<EngineeringChange />} />
            <Route path="engineering-change/new" element={<EngineeringChange />} />
            <Route path="dvpr" element={<DVPR />} />
            <Route path="dvpr/:partId" element={<DVPR />} />
            <Route path="dvpr/prototype" element={<PrototypeBuildAndTest />} />
            <Route path="apqp" element={<APQPTracker />} />
            <Route path="apqp/:id" element={<APQPTracker />} />
            <Route
              path="gate-approvals"
              element={
                <RoleGuard
                  roles={['CHIEF_ENGINEER', 'PROGRAM_MANAGER', 'QUALITY_ENGINEER']}
                >
                  <GateApprovalsHub />
                </RoleGuard>
              }
            />
            <Route path="documents" element={<DocumentLibrary />} />
            <Route
              path="analytics"
              element={
                <RoleGuard action="VIEW_ANALYTICS">
                  <ExecutiveDashboard />
                </RoleGuard>
              }
            />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="notifications" element={<NotificationCenter />} />
            <Route path="settings/integrations" element={<IntegrationHub />} />
            <Route
              path="settings/users"
              element={
                <RoleGuard roles={['SYS_ADMIN']}>
                  <UserManagement />
                </RoleGuard>
              }
            />
            <Route path="settings/profile" element={<ProfileCenter />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="search" element={<SearchPage />} />

            {/* MFG */}
            <Route path="mfg/planning" element={<PlanningPage />} />
            <Route path="mfg/operations" element={<OperationsDashboardPage />} />
            <Route path="mfg/work-orders" element={<WorkOrderManagementPage />} />
            <Route path="mfg/takt" element={<TaktTimePage />} />
            <Route path="mfg/andon" element={<AndonManagementPage />} />
            <Route path="mfg/assembly" element={<LiveAssemblyFeedPage />} />
            <Route path="mfg/handover" element={<ShiftHandoverPage />} />
            <Route path="mfg/oee" element={<OeeAnalyticsPage />} />
            <Route path="mfg/alerts" element={<SystemAlertsPage />} />
            <Route path="mfg/breakdowns" element={<MachineBreakdownPage />} />
            <Route path="mfg/tooling" element={<ToolingEquipmentPage />} />
            <Route path="mfg/registry" element={<MachineRegistryPage />} />
            <Route path="mfg/parts" element={<SparePartsInventoryPage />} />
            <Route path="mfg/quality-gate" element={<ProductionQualityGatePage />} />
            <Route path="mfg/scrap-rework" element={<ScrapReworkPage />} />
            <Route path="mfg/eol" element={<EolTestingPage />} />
            <Route path="mfg/traceability" element={<VinTraceabilityPage />} />
            <Route path="mfg/reports" element={<ReportsAnalyticsPage />} />
            <Route
              path="mfg/users"
              element={
                <RoleGuard roles={['PLANT_MANAGER', 'PRODUCTION_MANAGER', 'SYS_ADMIN']}>
                  <UserRoleManagementPage />
                </RoleGuard>
              }
            />
            <Route path="mfg/config" element={<SystemConfigPage />} />
            <Route path="mfg/support" element={<HelpSupportPage />} />

            {/* SCM (wrapped in SCM domain context) */}
            <Route path="scm/dashboard"   element={<ScmRouteWrapper><SCMDashboard /></ScmRouteWrapper>} />
            <Route path="scm/suppliers"   element={<ScmRouteWrapper><SupplierManagement /></ScmRouteWrapper>} />
            <Route path="scm/prs"         element={<ScmRouteWrapper><PurchaseRequisitions /></ScmRouteWrapper>} />
            <Route path="scm/rfqs"        element={<ScmRouteWrapper><RFQManagement /></ScmRouteWrapper>} />
            <Route path="scm/pos"         element={<ScmRouteWrapper><PurchaseOrders /></ScmRouteWrapper>} />
            <Route path="scm/grn"         element={<ScmRouteWrapper><GoodsReceipt /></ScmRouteWrapper>} />
            <Route path="scm/performance" element={<ScmRouteWrapper><SupplierPerformance /></ScmRouteWrapper>} />
            <Route path="scm/shortages"   element={<ScmRouteWrapper><ShortageManagement /></ScmRouteWrapper>} />
            <Route path="scm/contracts"   element={<ScmRouteWrapper><ContractManagement /></ScmRouteWrapper>} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}
