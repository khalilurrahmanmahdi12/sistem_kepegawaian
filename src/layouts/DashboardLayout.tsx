import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  useLocation,
} from 'react-router'

import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const location =
    useLocation()

  const [
    sidebarTerbuka,
    setSidebarTerbuka,
  ] = useState(false)

  useEffect(() => {
    setSidebarTerbuka(false)
  }, [location.pathname])

  useEffect(() => {
    const handleResize =
      () => {
        if (
          window.innerWidth >=
          1024
        ) {
          setSidebarTerbuka(
            false
          )
        }
      }

    window.addEventListener(
      'resize',
      handleResize
    )

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        terbuka={
          sidebarTerbuka
        }
        tutupSidebar={() =>
          setSidebarTerbuka(
            false
          )
        }
      />

      <div className="min-h-screen min-w-0 lg:pl-64">
        <Navbar
          bukaSidebar={() =>
            setSidebarTerbuka(
              true
            )
          }
        />

        <main className="min-w-0 overflow-x-hidden p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}