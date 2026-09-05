import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import {
  BriefcaseBusiness,
  Save,
  X,
} from 'lucide-react'

import { toast } from 'sonner'

import type {
  Division,
  OrganizationStatus,
  Position,
} from '../../types/organization'

interface Props {
  terbuka: boolean
  position: Position | null
  divisions: Division[]
  onClose: () => void
  onSubmit: (
    data: Omit<
      Position,
      'id'
    >
  ) => void
}

export default function PositionFormModal({
  terbuka,
  position,
  divisions,
  onClose,
  onSubmit,
}: Props) {
  const [
    divisionId,
    setDivisionId,
  ] = useState('')

  const [
    nama,
    setNama,
  ] = useState('')

  const [
    level,
    setLevel,
  ] = useState('Staff')

  const [
    status,
    setStatus,
  ] =
    useState<OrganizationStatus>(
      'Aktif'
    )

  const activeDivisions =
    divisions.filter(
      (item) =>
        item.status ===
          'Aktif' ||
        item.id ===
          position?.divisionId
    )

  useEffect(() => {
    if (position) {
      setDivisionId(
        position.divisionId
      )

      setNama(
        position.nama
      )

      setLevel(
        position.level
      )

      setStatus(
        position.status
      )
    } else {
      setDivisionId(
        activeDivisions[0]
          ?.id ?? ''
      )

      setNama('')
      setLevel('Staff')
      setStatus('Aktif')
    }
  }, [
    position,
    terbuka,
  ])

  if (!terbuka) {
    return null
  }

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault()

    if (
      !divisionId ||
      !nama.trim()
    ) {
      toast.error(
        'Divisi dan nama jabatan wajib diisi.'
      )

      return
    }

    onSubmit({
      divisionId,
      nama: nama.trim(),
      level,
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {position
                ? 'Edit Jabatan'
                : 'Tambah Jabatan'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tentukan jabatan dan divisi terkait.
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

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
            <BriefcaseBusiness
              size={22}
            />
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Divisi
              </label>

              <select
                value={divisionId}
                onChange={(event) =>
                  setDivisionId(
                    event.target.value
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-slate-900"
              >
                <option value="">
                  Pilih Divisi
                </option>

                {activeDivisions.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.nama}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Nama Jabatan
              </label>

              <input
                value={nama}
                onChange={(event) =>
                  setNama(
                    event.target.value
                  )
                }
                placeholder="Contoh: Software Developer"
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Level Jabatan
              </label>

              <select
                value={level}
                onChange={(event) =>
                  setLevel(
                    event.target.value
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-slate-900"
              >
                <option value="Staff">
                  Staff
                </option>

                <option value="Supervisor">
                  Supervisor
                </option>

                <option value="Manager">
                  Manager
                </option>

                <option value="Head">
                  Head
                </option>

                <option value="Director">
                  Director
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as OrganizationStatus
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-slate-900"
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

          <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Save size={17} />

              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}