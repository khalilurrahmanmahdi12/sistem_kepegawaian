import {
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

import type {
  PermissionType,
} from '../../types/permission'

interface PermissionFormModalProps {
  terbuka: boolean

  onClose: () => void

  onSubmit: (data: {
    jenisIzin: PermissionType
    tanggal: string
    jamMulai: string
    jamSelesai: string
    durasiMenit: number
    alasan: string
    lampiran?: string
  }) => void
}

function hitungDurasi(
  mulai: string,
  selesai: string
) {
  if (!mulai || !selesai) {
    return 0
  }

  const [jamMulai, menitMulai] =
    mulai.split(':').map(Number)

  const [jamSelesai, menitSelesai] =
    selesai.split(':').map(Number)

  const totalMulai =
    jamMulai * 60 + menitMulai

  const totalSelesai =
    jamSelesai * 60 + menitSelesai

  return Math.max(
    0,
    totalSelesai - totalMulai
  )
}

function formatDurasi(
  menit: number
) {
  if (menit <= 0) {
    return '0 Jam'
  }

  const jam =
    Math.floor(menit / 60)

  const sisaMenit =
    menit % 60

  if (
    jam > 0 &&
    sisaMenit > 0
  ) {
    return `${jam} Jam ${sisaMenit} Menit`
  }

  if (jam > 0) {
    return `${jam} Jam`
  }

  return `${sisaMenit} Menit`
}

export default function PermissionFormModal({
  terbuka,
  onClose,
  onSubmit,
}: PermissionFormModalProps) {
  const [
    jenisIzin,
    setJenisIzin,
  ] =
    useState<PermissionType>(
      'Izin Pribadi'
    )

  const [
    tanggal,
    setTanggal,
  ] = useState('')

  const [
    jamMulai,
    setJamMulai,
  ] = useState('')

  const [
    jamSelesai,
    setJamSelesai,
  ] = useState('')

  const [
    alasan,
    setAlasan,
  ] = useState('')

  const [
    lampiran,
    setLampiran,
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

  if (!terbuka) {
    return null
  }

  const resetForm = () => {
    setJenisIzin(
      'Izin Pribadi'
    )

    setTanggal('')
    setJamMulai('')
    setJamSelesai('')
    setAlasan('')
    setLampiran('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault()

    if (
      !tanggal ||
      !jamMulai ||
      !jamSelesai ||
      !alasan.trim()
    ) {
      toast.error(
        'Lengkapi data pengajuan izin.'
      )

      return
    }

    if (durasiMenit <= 0) {
      toast.error(
        'Jam selesai harus lebih besar dari jam mulai.'
      )

      return
    }

    onSubmit({
      jenisIzin,
      tanggal,
      jamMulai,
      jamSelesai,
      durasiMenit,
      alasan,
      lampiran:
        lampiran || undefined,
    })

    resetForm()
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900'

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4">
      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Ajukan Izin
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Lengkapi informasi izin Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* CONTENT SCROLL */}
          <div
            className="
              flex-1
              overflow-y-auto
              px-6
              py-5
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div className="grid gap-5 md:grid-cols-2">
              {/* Jenis Izin */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Jenis Izin
                </label>

                <select
                  value={jenisIzin}
                  onChange={(event) =>
                    setJenisIzin(
                      event.target
                        .value as PermissionType
                    )
                  }
                  className={inputClass}
                >
                  <option value="Izin Pribadi">
                    Izin Pribadi
                  </option>

                  <option value="Izin Keluarga">
                    Izin Keluarga
                  </option>

                  <option value="Izin Keperluan Resmi">
                    Izin Keperluan Resmi
                  </option>

                  <option value="Izin Terlambat">
                    Izin Terlambat
                  </option>

                  <option value="Izin Pulang Cepat">
                    Izin Pulang Cepat
                  </option>

                  <option value="Lainnya">
                    Lainnya
                  </option>
                </select>
              </div>

              {/* Tanggal */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Tanggal Izin
                </label>

                <input
                  type="date"
                  value={tanggal}
                  onChange={(event) =>
                    setTanggal(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              {/* Jam Mulai */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Jam Mulai
                </label>

                <input
                  type="time"
                  value={jamMulai}
                  onChange={(event) =>
                    setJamMulai(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              {/* Jam Selesai */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Jam Selesai
                </label>

                <input
                  type="time"
                  value={jamSelesai}
                  onChange={(event) =>
                    setJamSelesai(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              {/* Durasi */}
              <div className="md:col-span-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock3 size={15} />

                    Durasi Izin
                  </div>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {formatDurasi(
                      durasiMenit
                    )}
                  </p>
                </div>
              </div>

              {/* Alasan */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Alasan Izin
                </label>

                <textarea
                  rows={4}
                  value={alasan}
                  onChange={(event) =>
                    setAlasan(
                      event.target.value
                    )
                  }
                  placeholder="Tuliskan alasan izin..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Lampiran */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Lampiran
                </label>

                <input
                  type="text"
                  value={lampiran}
                  onChange={(event) =>
                    setLampiran(
                      event.target.value
                    )
                  }
                  placeholder="Contoh: surat-keterangan.pdf"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Lampiran masih berupa simulasi nama file.
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Send size={17} />

              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}