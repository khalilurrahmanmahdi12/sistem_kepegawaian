import {
  Bell,
  Menu,
  Settings,
  UserRound,
} from 'lucide-react'

import {
  useState,
} from 'react'

import { useNavigate } from 'react-router'

import { useAuth } from '../../context/AuthContext'

interface NavbarProps {
  bukaSidebar: () => void
}

export default function Navbar({
  bukaSidebar,
}: NavbarProps) {
  const {
    user,
  } = useAuth()

  const navigate =
    useNavigate()

  const [
    menuAkunTerbuka,
    setMenuAkunTerbuka,
  ] = useState(false)

  if (!user) {
    return null
  }

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-3
        shadow-sm
        sm:px-4
        lg:px-6
      "
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={bukaSidebar}
          aria-label="Buka sidebar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
            Selamat datang,
          </p>

          <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
            {user.nama}
          </h2>

          <p className="hidden truncate text-xs text-slate-500 sm:block">
            {user.jabatan}
            {' • '}
            {user.divisi}
          </p>
        </div>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          aria-label="Notifikasi"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <Bell size={19} />

          <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setMenuAkunTerbuka(
                !menuAkunTerbuka
              )
            }
            className="rounded-xl px-2 py-1.5 text-right transition hover:bg-slate-100 sm:px-3"
          >
            <p className="max-w-[80px] truncate text-xs font-semibold text-slate-900 sm:max-w-[150px] sm:text-sm">
              {user.nama}
            </p>

            <p className="max-w-[80px] truncate text-[10px] text-slate-500 sm:max-w-[150px] sm:text-xs">
              {user.role}
            </p>
          </button>

          {menuAkunTerbuka && (
            <>
              <button
                type="button"
                aria-label="Tutup menu akun"
                onClick={() =>
                  setMenuAkunTerbuka(false)
                }
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.nama}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuAkunTerbuka(false)

                      navigate(
                        '/profil'
                      )
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    <UserRound size={17} />
                    Profil Saya
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuAkunTerbuka(false)

                      navigate(
                        '/pengaturan'
                      )
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    <Settings size={17} />
                    Pengaturan
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}