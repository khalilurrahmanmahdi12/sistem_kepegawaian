import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import {
  Building2,
  Save,
  X,
} from 'lucide-react'

import { toast } from 'sonner'

import type {
  Division,
  OrganizationStatus,
} from '../../types/organization'

interface DivisionFormModalProps {
  terbuka: boolean
  division: Division | null

  onClose: () => void

  onSubmit: (
    data: Omit<
      Division,
      'id'
    >
  ) => void
}

export default function DivisionFormModal({
  terbuka,
  division,
  onClose,
  onSubmit,
}: DivisionFormModalProps) {
  const [
    nama,
    setNama,
  ] = useState('')

  const [
    kode,
    setKode,
  ] = useState('')

  const [
    deskripsi,
    setDeskripsi,
  ] = useState('')

  const [
    status,
    setStatus,
  ] =
    useState<OrganizationStatus>(
      'Aktif'
    )

  useEffect(() => {
    if (!terbuka) {
      return
    }

    if (division) {
      setNama(
        division.nama
      )

      setKode(
        division.kode
      )

      setDeskripsi(
        division.deskripsi
      )

      setStatus(
        division.status
      )
    } else {
      setNama('')
      setKode('')
      setDeskripsi('')
      setStatus('Aktif')
    }
  }, [
    division,
    terbuka,
  ])

  if (!terbuka) {
    return null
  }

  const resetForm =
    () => {
      setNama('')
      setKode('')
      setDeskripsi('')
      setStatus('Aktif')
    }

  const handleClose =
    () => {
      resetForm()
      onClose()
    }

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault()

    if (
      !nama.trim() ||
      !kode.trim()
    ) {
      toast.error(
        'Nama dan kode divisi wajib diisi.'
      )

      return
    }

    onSubmit({
      nama:
        nama.trim(),

      kode:
        kode
          .trim()
          .toUpperCase(),

      deskripsi:
        deskripsi.trim(),

      status,
    })
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
          max-w-lg
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
              {division
                ? 'Edit Divisi'
                : 'Tambah Divisi'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Kelola master data divisi perusahaan.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
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
              px-6
              py-5
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Building2
                size={22}
              />
            </div>

            <div className="space-y-5">
              {/* Nama Divisi */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nama Divisi
                </label>

                <input
                  type="text"
                  value={nama}
                  onChange={(
                    event
                  ) =>
                    setNama(
                      event.target
                        .value
                    )
                  }
                  placeholder="Contoh: Teknologi Informasi"
                  className={
                    inputClass
                  }
                />
              </div>

              {/* Kode Divisi */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Kode Divisi
                </label>

                <input
                  type="text"
                  value={kode}
                  maxLength={10}
                  onChange={(
                    event
                  ) =>
                    setKode(
                      event.target
                        .value
                    )
                  }
                  placeholder="Contoh: TI"
                  className={
                    inputClass
                  }
                />

                <p className="mt-2 text-xs text-slate-400">
                  Kode akan otomatis disimpan menggunakan huruf kapital.
                </p>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Deskripsi
                </label>

                <textarea
                  rows={4}
                  value={
                    deskripsi
                  }
                  onChange={(
                    event
                  ) =>
                    setDeskripsi(
                      event.target
                        .value
                    )
                  }
                  placeholder="Tuliskan deskripsi divisi..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={
                    status
                  }
                  onChange={(
                    event
                  ) =>
                    setStatus(
                      event.target
                        .value as OrganizationStatus
                    )
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="Aktif">
                    Aktif
                  </option>

                  <option value="Nonaktif">
                    Nonaktif
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={
                handleClose
              }
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Save size={17} />

              {division
                ? 'Simpan Perubahan'
                : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}