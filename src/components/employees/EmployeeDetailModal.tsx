import {
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
} from 'lucide-react'

import type { Employee } from '../../types/employee'

interface EmployeeDetailModalProps {
  employee: Employee | null
  onClose: () => void
}

export default function EmployeeDetailModal({
  employee,
  onClose,
}: EmployeeDetailModalProps) {
  if (!employee) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Detail Karyawan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Informasi lengkap data karyawan.
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

        <div className="p-6">
          <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
              <UserRound size={27} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {employee.nama}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {employee.nip}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {employee.statusKerja}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    employee.status === 'Aktif'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Info
              icon={BriefcaseBusiness}
              label="Jabatan"
              value={employee.jabatan}
            />

            <Info
              icon={BriefcaseBusiness}
              label="Divisi"
              value={employee.divisi}
            />

            <Info
              icon={Mail}
              label="Email"
              value={employee.email}
            />

            <Info
              icon={Phone}
              label="Nomor WhatsApp"
              value={employee.whatsapp}
            />

            <Info
              icon={CalendarDays}
              label="Tanggal Masuk"
              value={employee.tanggalMasuk}
            />

            <Info
              icon={CalendarDays}
              label="Tanggal Lahir"
              value={employee.tanggalLahir || '-'}
            />

            <Info
              icon={MapPin}
              label="Tempat Lahir"
              value={employee.tempatLahir || '-'}
            />

            <Info
              icon={UserRound}
              label="Jenis Kelamin"
              value={employee.jenisKelamin}
            />
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Alamat
            </p>

            <p className="mt-1 text-sm text-slate-800">
              {employee.alamat || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface InfoProps {
  icon: typeof Mail
  label: string
  value: string
}

function Info({
  icon: Icon,
  label,
  value,
}: InfoProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon size={17} />
      </div>

      <div>
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-900">
          {value}
        </p>
      </div>
    </div>
  )
}