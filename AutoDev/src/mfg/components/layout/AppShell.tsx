import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ChatBot } from '../chat/ChatBot'
import { GlobalDetailModal } from './GlobalDetailModal'
import { useAppStore } from '../../stores/appStore'
import { cn } from '../../lib/utils'

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-primary p-6">
          <Outlet />
        </main>
      </div>
      <ChatBot />
      <GlobalDetailModal />
    </div>
  )
}
