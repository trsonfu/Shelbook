import type { ReactNode } from 'react'
import FacebookHeader from '@/components/layout/FacebookHeader'
import FacebookLeftSidebar from '@/components/layout/FacebookLeftSidebar'
import FacebookRightSidebar from '@/components/layout/FacebookRightSidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18191a]">
      {/* Fixed Header */}
      <FacebookHeader />

      {/* Three-column layout */}
      <div className="pt-14">
        {/* Left Sidebar - Desktop only */}
        <FacebookLeftSidebar />

        {/* Main Content - Center column */}
        <main className="lg:ml-72 xl:mr-80 min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>

        {/* Right Sidebar - Desktop only */}
        <FacebookRightSidebar />

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}

