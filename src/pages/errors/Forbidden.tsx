import {
  ArrowLeft,
  Home,
  ShieldX,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router'

export default function Forbidden() {
  const navigate =
    useNavigate()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <ShieldX size={38} />
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
          Error 403
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Akses Ditolak
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          Anda tidak memiliki hak akses untuk membuka halaman ini.
          Silakan kembali ke halaman yang sesuai dengan peran akun Anda.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={17} />

            Kembali
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                '/dashboard'
              )
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Home size={17} />

            Ke Dasbor
          </button>
        </div>
      </div>
    </div>
  )
}