import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  judul: string
  nilai: string | number
  keterangan: string
  icon: LucideIcon
  perubahan?: string
  positif?: boolean
}

export default function StatCard({
  judul,
  nilai,
  keterangan,
  icon: Icon,
  perubahan,
  positif = true,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {judul}
          </p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {nilai}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {perubahan && (
          <span
            className={
              positif
                ? 'font-semibold text-emerald-600'
                : 'font-semibold text-red-600'
            }
          >
            {perubahan}
          </span>
        )}

        <span className="text-slate-500">
          {keterangan}
        </span>
      </div>
    </div>
  )
}