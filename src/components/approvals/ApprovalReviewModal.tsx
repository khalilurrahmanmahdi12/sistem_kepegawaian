import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  X,
  XCircle,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import { toast } from 'sonner'

export type ApprovalType =
  | 'Cuti'
  | 'Izin'
  | 'Lembur'

export interface UnifiedApproval {
  id: string
  sourceId: string

  jenis: ApprovalType

  nama: string
  nip: string
  divisi: string

  tanggal: string
  periode: string
  durasi: string

  alasan: string

  status:
    | 'Menunggu'
    | 'Disetujui'
    | 'Ditolak'

  tanggalPengajuan: string

  catatan?: string
  diprosesOleh?: string
}

interface ApprovalReviewModalProps {
  request: UnifiedApproval | null

  onClose: () => void

  onApprove: (
    catatan: string
  ) => void

  onReject: (
    catatan: string
  ) => void
}

function formatTanggal(
  tanggal: string
) {
  if (!tanggal) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  ).format(
    new Date(
      `${tanggal}T00:00:00`
    )
  )
}

export default function ApprovalReviewModal({
  request,
  onClose,
  onApprove,
  onReject,
}: ApprovalReviewModalProps) {
  const [
    catatan,
    setCatatan,
  ] = useState('')

  useEffect(() => {
    setCatatan('')
  }, [request])

  if (!request) {
    return null
  }

  const handleReject = () => {
    if (!catatan.trim()) {
      toast.error(
        'Masukkan alasan penolakan.'
      )

      return
    }

    onReject(catatan)
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <div className="mb-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {request.jenis}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Tinjau Pengajuan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Periksa informasi sebelum memberikan keputusan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          className="
            max-h-[calc(90vh-160px)]
            overflow-y-auto
            p-6
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div className="rounded-xl bg-slate-50 p-5">
            <h3 className="font-bold text-slate-900">
              {request.nama}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {request.nip} • {request.divisi}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info
                icon={FileText}
                label="Jenis Pengajuan"
                value={request.jenis}
              />

              <Info
                icon={CalendarDays}
                label="Tanggal"
                value={formatTanggal(
                  request.tanggal
                )}
              />

              <Info
                icon={CalendarDays}
                label="Periode / Waktu"
                value={request.periode}
              />

              <Info
                icon={Clock3}
                label="Durasi"
                value={request.durasi}
              />
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                Alasan / Keterangan
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-800">
                {request.alasan}
              </p>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                Tanggal Pengajuan
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatTanggal(
                  request.tanggalPengajuan
                )}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700">
              Catatan Persetujuan / Penolakan
            </label>

            <textarea
              rows={4}
              value={catatan}
              onChange={(event) =>
                setCatatan(
                  event.target.value
                )
              }
              placeholder="Tambahkan catatan..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />

            <p className="mt-2 text-xs text-slate-400">
              Catatan wajib diisi apabila pengajuan ditolak.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleReject}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <XCircle size={17} />

              Tolak
            </button>

            <button
              type="button"
              onClick={() =>
                onApprove(
                  catatan ||
                    'Pengajuan disetujui.'
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <CheckCircle2
                size={17}
              />

              Setujui
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Icon size={14} />

        {label}
      </div>

      <p className="mt-1.5 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  )
}