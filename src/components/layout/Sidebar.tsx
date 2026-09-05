import type {
  ElementType,
} from 'react'

import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from 'lucide-react'

import { NavLink } from 'react-router'

import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  terbuka: boolean
  tutupSidebar: () => void
}

interface MenuItem {
  label: string
  path: string
  icon: ElementType
  roles: string[]
}

const menus: MenuItem[] = [
  {
    label: 'Dasbor',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: [
      'Administrator',
      'HR',
      'Manager',
      'Karyawan',
    ],
  },
  {
    label: 'Data Karyawan',
    path: '/karyawan',
    icon: Users,
    roles: [
      'Administrator',
      'HR',
      'Manager',
    ],
  },
  {
    label: 'Absensi',
    path: '/absensi',
    icon: Clock3,
    roles: [
      'Administrator',
      'HR',
      'Manager',
      'Karyawan',
    ],
  },
  {
    label: 'Cuti',
    path: '/cuti',
    icon: CalendarDays,
    roles: [
      'Administrator',
      'HR',
      'Manager',
      'Karyawan',
    ],
  },
  {
    label: 'Izin',
    path: '/izin',
    icon: FileText,
    roles: [
      'Administrator',
      'HR',
      'Manager',
      'Karyawan',
    ],
  },
  {
    label: 'Lembur',
    path: '/lembur',
    icon: Clock3,
    roles: [
      'Administrator',
      'HR',
      'Manager',
      'Karyawan',
    ],
  },
  {
    label: 'Persetujuan',
    path: '/persetujuan',
    icon: ClipboardCheck,
    roles: [
      'Administrator',
      'HR',
      'Manager',
    ],
  },
  {
    label: 'Divisi & Jabatan',
    path: '/divisi',
    icon: Building2,
    roles: [
      'Administrator',
      'HR',
      'Manager',
    ],
  },
  {
    label: 'Laporan',
    path: '/laporan',
    icon: BarChart3,
    roles: [
      'Administrator',
      'HR',
      'Manager',
    ],
  },
  {
    label: 'Pengaturan',
    path: '/pengaturan',
    icon: Settings,
    roles: [
      'Administrator',
      'HR',
      'Manager',
      'Karyawan',
    ],
  },
]

export default function Sidebar({
  terbuka,
  tutupSidebar,
}: SidebarProps) {
  const {
    user,
    logout,
  } = useAuth()

  if (!user) {
    return null
  }

  const menuTampil =
    menus.filter((menu) =>
      menu.roles.includes(
        user.role
      )
    )

  return (
    <>
      <button
        type="button"
        aria-label="Tutup sidebar"
        onClick={tutupSidebar}
        className={`
          fixed
          inset-0
          z-40
          bg-slate-950/55
          backdrop-blur-[1px]
          transition-opacity
          duration-300
          lg:hidden

          ${
            terbuka
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }
        `}
      />

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-64
          flex-col
          border-r
          border-slate-800
          bg-[#020617]
          text-white
          transition-transform
          duration-300
          ease-in-out
          lg:translate-x-0

          ${
            terbuka
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-4">
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-white">
              Kepegawaian Digital
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Sistem Manajemen SDM
            </p>
          </div>

          <button
            type="button"
            onClick={tutupSidebar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <div className="shrink-0 border-b border-slate-800 p-3">
          <div className="rounded-xl bg-slate-900 px-3 py-3">
            <p className="truncate text-sm font-semibold text-white">
              {user.nama}
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {user.role}
            </p>
          </div>
        </div>

        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            px-3
            py-3
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {menuTampil.map(
            ({
              label,
              path,
              icon: Icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                onClick={tutupSidebar}
                className={({
                  isActive,
                }) =>
                  `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition

                  ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }
                `
                }
              >
                <Icon
                  size={18}
                  className="shrink-0"
                />

                <span className="truncate">
                  {label}
                </span>
              </NavLink>
            )
          )}
        </nav>

        <div className="shrink-0 border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />

            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}