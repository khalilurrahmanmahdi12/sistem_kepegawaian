import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import {
  Save,
  X,
} from 'lucide-react'

import { toast } from 'sonner'

import type {
  Employee,
  EmploymentStatus,
} from '../../types/employee'

interface EmployeeFormModalProps {
  terbuka: boolean
  mode: 'tambah' | 'edit'
  employee?: Employee | null
  onClose: () => void
  onSubmit: (
    employee: Omit<Employee, 'id'>
  ) => void
}

const initialForm: Omit<Employee, 'id'> = {
  nip: '',
  nama: '',
  email: '',
  whatsapp: '',
  jenisKelamin: 'Laki-laki',
  tempatLahir: '',
  tanggalLahir: '',
  alamat: '',
  divisi: '',
  jabatan: '',
  statusKerja: 'Tetap',
  status: 'Aktif',
  tanggalMasuk: '',
}

export default function EmployeeFormModal({
  terbuka,
  mode,
  employee,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const [form, setForm] =
    useState<Omit<Employee, 'id'>>(initialForm)

  useEffect(() => {
    if (
      mode === 'edit' &&
      employee
    ) {
      const {
        id: _id,
        ...data
      } = employee

      setForm(data)
    } else {
      setForm(initialForm)
    }
  }, [
    employee,
    mode,
    terbuka,
  ])

  if (!terbuka) {
    return null
  }

  const updateForm = (
    field: keyof Omit<Employee, 'id'>,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault()

    if (
      !form.nip ||
      !form.nama ||
      !form.email ||
      !form.whatsapp ||
      !form.divisi ||
      !form.jabatan ||
      !form.tanggalMasuk
    ) {
      toast.error(
        'Lengkapi data wajib terlebih dahulu.'
      )

      return
    }

    onSubmit(form)
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'tambah'
                ? 'Tambah Karyawan'
                : 'Edit Data Karyawan'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Lengkapi informasi karyawan.
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
          className="
            max-h-[calc(90vh-150px)]
            overflow-y-auto
            px-6
            py-6
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                NIP / ID Karyawan *
              </label>

              <input
                type="text"
                value={form.nip}
                onChange={(event) =>
                  updateForm(
                    'nip',
                    event.target.value
                  )
                }
                placeholder="KRY-2026-013"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Nama Lengkap *
              </label>

              <input
                type="text"
                value={form.nama}
                onChange={(event) =>
                  updateForm(
                    'nama',
                    event.target.value
                  )
                }
                placeholder="Nama karyawan"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Email *
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateForm(
                    'email',
                    event.target.value
                  )
                }
                placeholder="nama@perusahaan.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Nomor WhatsApp *
              </label>

              <input
                type="text"
                value={form.whatsapp}
                onChange={(event) =>
                  updateForm(
                    'whatsapp',
                    event.target.value.replace(
                      /\D/g,
                      ''
                    )
                  )
                }
                placeholder="081234567890"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Jenis Kelamin
              </label>

              <select
                value={form.jenisKelamin}
                onChange={(event) =>
                  updateForm(
                    'jenisKelamin',
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="Laki-laki">
                  Laki-laki
                </option>

                <option value="Perempuan">
                  Perempuan
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Tempat Lahir
              </label>

              <input
                type="text"
                value={form.tempatLahir}
                onChange={(event) =>
                  updateForm(
                    'tempatLahir',
                    event.target.value
                  )
                }
                placeholder="Contoh: Samarinda"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Tanggal Lahir
              </label>

              <input
                type="date"
                value={form.tanggalLahir}
                onChange={(event) =>
                  updateForm(
                    'tanggalLahir',
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Tanggal Masuk *
              </label>

              <input
                type="date"
                value={form.tanggalMasuk}
                onChange={(event) =>
                  updateForm(
                    'tanggalMasuk',
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Divisi *
              </label>

              <select
                value={form.divisi}
                onChange={(event) =>
                  updateForm(
                    'divisi',
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Pilih divisi
                </option>

                <option value="Human Resources">
                  Human Resources
                </option>

                <option value="Teknologi Informasi">
                  Teknologi Informasi
                </option>

                <option value="Operasional">
                  Operasional
                </option>

                <option value="Keuangan">
                  Keuangan
                </option>

                <option value="Administrasi">
                  Administrasi
                </option>

                <option value="Pemasaran">
                  Pemasaran
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Jabatan *
              </label>

              <input
                type="text"
                value={form.jabatan}
                onChange={(event) =>
                  updateForm(
                    'jabatan',
                    event.target.value
                  )
                }
                placeholder="Contoh: Staff Operasional"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Status Kerja
              </label>

              <select
                value={form.statusKerja}
                onChange={(event) =>
                  updateForm(
                    'statusKerja',
                    event.target.value as EmploymentStatus
                  )
                }
                className={inputClass}
              >
                <option value="Tetap">
                  Tetap
                </option>

                <option value="Kontrak">
                  Kontrak
                </option>

                <option value="Magang">
                  Magang
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Status Karyawan
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateForm(
                    'status',
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="Aktif">
                  Aktif
                </option>

                <option value="Nonaktif">
                  Nonaktif
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Alamat
              </label>

              <textarea
                rows={3}
                value={form.alamat}
                onChange={(event) =>
                  updateForm(
                    'alamat',
                    event.target.value
                  )
                }
                placeholder="Alamat lengkap karyawan"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Save size={17} />

              {mode === 'tambah'
                ? 'Simpan Karyawan'
                : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}