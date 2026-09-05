import {
  AlertTriangle,
  X,
} from 'lucide-react'

interface ConfirmModalProps {
  terbuka: boolean
  judul: string
  pesan: string
  labelKonfirmasi?: string
  labelBatal?: string
  tipe?: 'bahaya' | 'normal'
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({
  terbuka,
  judul,
  pesan,
  labelKonfirmasi = 'Konfirmasi',
  labelBatal = 'Batal',
  tipe = 'normal',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!terbuka) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="flex gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                tipe === 'bahaya'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {judul}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {pesan}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {labelBatal}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
              tipe === 'bahaya'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-slate-950 hover:bg-slate-800'
            }`}
          >
            {labelKonfirmasi}
          </button>
        </div>
      </div>
    </div>
  )
}