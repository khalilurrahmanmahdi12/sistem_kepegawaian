import {
  CheckCircle2,
  X,
  XCircle,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  toast,
} from 'sonner'

import type {
  LeaveRequest,
} from '../../types/leave'

interface LeaveReviewModalProps {
  request: LeaveRequest | null
  onClose: () => void
  onApprove: (
    catatan: string
  ) => void
  onReject: (
    catatan: string
  ) => void
}

export default function LeaveReviewModal({
  request,
  onClose,
  onApprove,
  onReject,
}: LeaveReviewModalProps) {
  const [
    catatan,
    setCatatan,
  ] = useState('')

  if (!request) {
    return null
  }

  const handleReject =
    () => {
      if (
        !catatan.trim()
      ) {
        toast.error(
          'Masukkan alasan penolakan.'
        )

        return
      }

      onReject(catatan)
    }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Tinjau Pengajuan Cuti
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Periksa detail sebelum memberikan keputusan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-xl bg-slate-50 p-5">
            <h3 className="font-bold text-slate-900">
              {request.nama}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {request.nip} • {request.divisi}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info
                label="Jenis Cuti"
                value={
                  request.jenisCuti
                }
              />

              <Info
                label="Durasi"
                value={`${request.jumlahHari} Hari`}
              />

              <Info
                label="Tanggal Mulai"
                value={
                  request.tanggalMulai
                }
              />

              <Info
                label="Tanggal Selesai"
                value={
                  request.tanggalSelesai
                }
              />
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-500">
                Alasan
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-800">
                {request.alasan}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700">
              Catatan Persetujuan / Penolakan
            </label>

            <textarea
              rows={3}
              value={catatan}
              onChange={(event) =>
                setCatatan(
                  event.target.value
                )
              }
              placeholder="Tambahkan catatan..."
              className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleReject
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
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
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
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
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  )
}