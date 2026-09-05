import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import {
  Clock3,
  Send,
  X,
} from 'lucide-react'

import { toast } from 'sonner'

interface OvertimeFormModalProps {
  terbuka: boolean

  onClose: () => void

  onSubmit: (data: {
    tanggal: string
    jamMulai: string
    jamSelesai: string
    durasiMenit: number
    alasan: string
  }) => void
}

function hitungDurasi(
  jamMulai: string,
  jamSelesai: string
) {
  if (
    !jamMulai ||
    !jamSelesai
  ) {
    return 0
  }

  const [
    mulaiJam,
    mulaiMenit,
  ] =
    jamMulai
      .split(':')
      .map(Number)

  const [
    selesaiJam,
    selesaiMenit,
  ] =
    jamSelesai
      .split(':')
      .map(Number)

  const mulai =
    mulaiJam * 60 +
    mulaiMenit

  const selesai =
    selesaiJam * 60 +
    selesaiMenit

  return Math.max(
    0,
    selesai - mulai
  )
}

function formatDurasi(
  menit: number
) {
  const jam =
    Math.floor(
      menit / 60
    )

  const sisa =
    menit % 60

  if (
    jam > 0 &&
    sisa > 0
  ) {
    return `${jam} Jam ${sisa} Menit`
  }

  if (jam > 0) {
    return `${jam} Jam`
  }

  return `${sisa} Menit`
}

export default function OvertimeFormModal({
  terbuka,
  onClose,
  onSubmit,
}: OvertimeFormModalProps) {
  const [
    tanggal,
    setTanggal,
  ] = useState('')

  const [
    jamMulai,
    setJamMulai,
  ] =
    useState('17:00')

  const [
    jamSelesai,
    setJamSelesai,
  ] = useState('')

  const [
    alasan,
    setAlasan,
  ] = useState('')

  const durasiMenit =
    useMemo(
      () =>
        hitungDurasi(
          jamMulai,
          jamSelesai
        ),
      [
        jamMulai,
        jamSelesai,
      ]
    )

  useEffect(() => {
    if (!terbuka) {
      return
    }

    setTanggal('')
    setJamMulai('17:00')
    setJamSelesai('')
    setAlasan('')
  }, [terbuka])

  if (!terbuka) {
    return null
  }

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault()

    if (!tanggal) {
      toast.error(
        'Tanggal lembur wajib diisi.'
      )
      return
    }

    if (
      !jamMulai ||
      !jamSelesai
    ) {
      toast.error(
        'Jam mulai dan selesai wajib diisi.'
      )
      return
    }

    if (
      durasiMenit <= 0
    ) {
      toast.error(
        'Jam selesai harus lebih besar dari jam mulai.'
      )
      return
    }

    if (
      !alasan.trim()
    ) {
      toast.error(
        'Alasan atau pekerjaan lembur wajib diisi.'
      )
      return
    }

    onSubmit({
      tanggal,
      jamMulai,
      jamSelesai,
      durasiMenit,
      alasan:
        alasan.trim(),
    })
  }

  const inputClass =
    'mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-900'

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-3 sm:p-4">
      <div
        className="
          flex
          max-h-[92dvh]
          w-full
          max-w-xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Ajukan Lembur
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Lengkapi informasi pengajuan lembur Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* CONTENT */}
          <div
            className="
              flex-1
              overflow-y-auto
              px-4
              py-4
              sm:px-6
              sm:py-5
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-slate-700 sm:text-sm">
                  Tanggal Lembur
                </label>

                <input
                  type="date"
                  value={tanggal}
                  onChange={(
                    event
                  ) =>
                    setTanggal(
                      event.target
                        .value
                    )
                  }
                  className={
                    inputClass
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 sm:text-sm">
                  Jam Mulai
                </label>

                <input
                  type="time"
                  value={
                    jamMulai
                  }
                  onChange={(
                    event
                  ) =>
                    setJamMulai(
                      event.target
                        .value
                    )
                  }
                  className={
                    inputClass
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 sm:text-sm">
                  Jam Selesai
                </label>

                <input
                  type="time"
                  value={
                    jamSelesai
                  }
                  onChange={(
                    event
                  ) =>
                    setJamSelesai(
                      event.target
                        .value
                    )
                  }
                  className={
                    inputClass
                  }
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock3 size={14} />
                  Durasi Lembur
                </div>

                <p className="mt-2 text-base font-bold text-slate-900">
                  {formatDurasi(
                    durasiMenit
                  )}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 sm:text-sm">
                  Alasan / Pekerjaan Lembur
                </label>

                <textarea
                  rows={4}
                  value={alasan}
                  onChange={(
                    event
                  ) =>
                    setAlasan(
                      event.target
                        .value
                    )
                  }
                  placeholder="Tuliskan pekerjaan atau alasan lembur..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="
              flex
              shrink-0
              gap-2
              border-t
              border-slate-200
              bg-white
              px-4
              py-3
              pb-[max(0.75rem,env(safe-area-inset-bottom))]
              sm:justify-end
              sm:px-6
              sm:py-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 sm:flex-none"
            >
              <Send size={16} />
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}