import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import {
  CalendarDays,
  Send,
  X,
} from 'lucide-react'

import { toast } from 'sonner'

import type {
  LeaveType,
} from '../../types/leave'

interface LeaveFormModalProps {
  terbuka: boolean
  saldoCuti: number
  onClose: () => void
  onSubmit: (data: {
    jenisCuti: LeaveType
    tanggalMulai: string
    tanggalSelesai: string
    jumlahHari: number
    alasan: string
  }) => void
}

function hitungJumlahHari(
  tanggalMulai: string,
  tanggalSelesai: string
) {
  if (
    !tanggalMulai ||
    !tanggalSelesai
  ) {
    return 0
  }

  const mulai =
    new Date(
      `${tanggalMulai}T00:00:00`
    )

  const selesai =
    new Date(
      `${tanggalSelesai}T00:00:00`
    )

  if (
    selesai < mulai
  ) {
    return 0
  }

  const selisih =
    selesai.getTime() -
    mulai.getTime()

  return (
    Math.floor(
      selisih /
        (1000 * 60 * 60 * 24)
    ) + 1
  )
}

export default function LeaveFormModal({
  terbuka,
  saldoCuti,
  onClose,
  onSubmit,
}: LeaveFormModalProps) {
  const [
    jenisCuti,
    setJenisCuti,
  ] =
    useState<LeaveType>(
      'Cuti Tahunan'
    )

  const [
    tanggalMulai,
    setTanggalMulai,
  ] = useState('')

  const [
    tanggalSelesai,
    setTanggalSelesai,
  ] = useState('')

  const [
    alasan,
    setAlasan,
  ] = useState('')

  const jumlahHari =
    useMemo(
      () =>
        hitungJumlahHari(
          tanggalMulai,
          tanggalSelesai
        ),
      [
        tanggalMulai,
        tanggalSelesai,
      ]
    )

  useEffect(() => {
    if (!terbuka) {
      return
    }

    setJenisCuti(
      'Cuti Tahunan'
    )
    setTanggalMulai('')
    setTanggalSelesai('')
    setAlasan('')
  }, [terbuka])

  if (!terbuka) {
    return null
  }

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault()

    if (
      !tanggalMulai ||
      !tanggalSelesai
    ) {
      toast.error(
        'Tanggal mulai dan selesai wajib diisi.'
      )
      return
    }

    if (
      jumlahHari <= 0
    ) {
      toast.error(
        'Tanggal selesai tidak valid.'
      )
      return
    }

    if (
      jenisCuti ===
        'Cuti Tahunan' &&
      jumlahHari >
        saldoCuti
    ) {
      toast.error(
        'Saldo cuti tahunan tidak mencukupi.'
      )
      return
    }

    if (
      !alasan.trim()
    ) {
      toast.error(
        'Alasan cuti wajib diisi.'
      )
      return
    }

    onSubmit({
      jenisCuti,
      tanggalMulai,
      tanggalSelesai,
      jumlahHari,
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
              Ajukan Cuti
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Lengkapi informasi pengajuan cuti Anda.
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
                  Jenis Cuti
                </label>

                <select
                  value={
                    jenisCuti
                  }
                  onChange={(
                    event
                  ) =>
                    setJenisCuti(
                      event.target
                        .value as LeaveType
                    )
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="Cuti Tahunan">
                    Cuti Tahunan
                  </option>

                  <option value="Cuti Sakit">
                    Cuti Sakit
                  </option>

                  <option value="Cuti Melahirkan">
                    Cuti Melahirkan
                  </option>

                  <option value="Cuti Menikah">
                    Cuti Menikah
                  </option>

                  <option value="Cuti Khusus">
                    Cuti Khusus
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 sm:text-sm">
                  Tanggal Mulai
                </label>

                <input
                  type="date"
                  value={
                    tanggalMulai
                  }
                  onChange={(
                    event
                  ) =>
                    setTanggalMulai(
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
                  Tanggal Selesai
                </label>

                <input
                  type="date"
                  min={
                    tanggalMulai
                  }
                  value={
                    tanggalSelesai
                  }
                  onChange={(
                    event
                  ) =>
                    setTanggalSelesai(
                      event.target
                        .value
                    )
                  }
                  className={
                    inputClass
                  }
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    Durasi
                  </div>

                  <p className="mt-2 text-base font-bold text-slate-900">
                    {jumlahHari} Hari
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Sisa Cuti Tahunan
                  </p>

                  <p className="mt-2 text-base font-bold text-slate-900">
                    {saldoCuti} Hari
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 sm:text-sm">
                  Alasan Cuti
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
                  placeholder="Tuliskan alasan pengajuan cuti..."
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