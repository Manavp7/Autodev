import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { LoginPage } from '../pages/LoginPage'

import { OperationsDashboardPage } from '../pages/OperationsDashboardPage'
import { PlanningPage } from '../pages/PlanningPage'
import { WorkOrderManagementPage } from '../pages/WorkOrderManagementPage'
import { TaktTimePage } from '../pages/TaktTimePage'
import { AndonManagementPage } from '../pages/AndonManagementPage'
import { LiveAssemblyFeedPage } from '../pages/LiveAssemblyFeedPage'
import { ShiftHandoverPage } from '../pages/ShiftHandoverPage'
import { OeeAnalyticsPage } from '../pages/OeeAnalyticsPage'
import { SystemAlertsPage } from '../pages/SystemAlertsPage'

import { ToolingEquipmentPage } from '../pages/ToolingEquipmentPage'
import { MachineBreakdownPage } from '../pages/MachineBreakdownPage'
import { MachineRegistryPage } from '../pages/MachineRegistryPage'
import { SparePartsInventoryPage } from '../pages/SparePartsInventoryPage'

import { ProductionQualityGatePage } from '../pages/ProductionQualityGatePage'
import { ScrapReworkPage } from '../pages/ScrapReworkPage'
import { EolTestingPage } from '../pages/EolTestingPage'
import { VinTraceabilityPage } from '../pages/VinTraceabilityPage'

import { ReportsAnalyticsPage } from '../pages/ReportsAnalyticsPage'
import { HelpSupportPage } from '../pages/HelpSupportPage'
import { UserRoleManagementPage } from '../pages/UserRoleManagementPage'
import { SystemConfigPage } from '../pages/SystemConfigPage'

export const router = createBrowserRouter([
  // Public
  { path: '/login', element: <LoginPage /> },

  // Protected – requires auth
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/operations" replace /> },

          // Planning
          { path: 'planning', element: <PlanningPage /> },

          // Operations
          { path: 'operations', element: <OperationsDashboardPage /> },
          { path: 'operations/work-orders', element: <WorkOrderManagementPage /> },
          { path: 'operations/takt', element: <TaktTimePage /> },
          { path: 'operations/andon', element: <AndonManagementPage /> },
          { path: 'operations/assembly', element: <LiveAssemblyFeedPage /> },
          { path: 'operations/handover', element: <ShiftHandoverPage /> },
          { path: 'operations/oee', element: <OeeAnalyticsPage /> },
          { path: 'operations/alerts', element: <SystemAlertsPage /> },

          // Maintenance
          { path: 'maintenance/breakdowns', element: <MachineBreakdownPage /> },
          { path: 'maintenance/tooling', element: <ToolingEquipmentPage /> },
          { path: 'maintenance/registry', element: <MachineRegistryPage /> },
          { path: 'maintenance/parts', element: <SparePartsInventoryPage /> },

          // Quality
          { path: 'quality/gate', element: <ProductionQualityGatePage /> },
          { path: 'quality/scrap-rework', element: <ScrapReworkPage /> },
          { path: 'quality/eol', element: <EolTestingPage /> },
          { path: 'quality/traceability', element: <VinTraceabilityPage /> },

          // Admin
          { path: 'admin/reports', element: <ReportsAnalyticsPage /> },
          { path: 'admin/users', element: <UserRoleManagementPage /> },
          { path: 'admin/config', element: <SystemConfigPage /> },

          // Help
          { path: 'support', element: <HelpSupportPage /> },
        ],
      },
    ],
  },
])
