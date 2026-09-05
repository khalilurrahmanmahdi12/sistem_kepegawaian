import {
  Bell,
  Database,
  LockKeyhole,
  Save,
  Settings2,
  ShieldCheck,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  toast,
} from 'sonner'

import {
  useAuth,
} from '../../context/AuthContext'

export default function Settings() {
  const {
    user,
  } = useAuth()

  const [
    notification,
    setNotification,
  ] = useState(true)

  const [
    emailNotification,
    setEmailNotification,
  ] = useState(true)

  const [
    approvalNotification,
    setApprovalNotification,
  ] = useState(true)

  const [
    compactMode,
    setCompactMode,
  ] = useState(false)

  if (!user) {
    return null
  }

  const isAdmin =
    user.role ===
    'Administrator'

  const handleSave = () => {
    const settings = {
      notification,
      emailNotification,
      approvalNotification,
      compactMode,
    }

    localStorage.setItem(
      `kepegawaian_settings_${user.id}`,
      JSON.stringify(
        settings
      )
    )

    toast.success(
      'Pengaturan berhasil disimpan.'
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pengaturan
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola preferensi dan pengaturan akun Anda.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleSave
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Save size={17} />

          Simpan Pengaturan
        </button>
      </div>

      {/* Notification */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Bell size={18} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Notifikasi
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Atur notifikasi aktivitas sistem.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <SettingToggle
            judul="Notifikasi Sistem"
            deskripsi="Tampilkan pemberitahuan aktivitas penting dalam aplikasi."
            aktif={
              notification
            }
            onChange={
              setNotification
            }
          />

          <SettingToggle
            judul="Notifikasi Email"
            deskripsi="Izinkan sistem mengirim simulasi pemberitahuan melalui email."
            aktif={
              emailNotification
            }
            onChange={
              setEmailNotification
            }
          />

          <SettingToggle
            judul="Notifikasi Persetujuan"
            deskripsi="Tampilkan pemberitahuan saat status Cuti, Izin, atau Lembur berubah."
            aktif={
              approvalNotification
            }
            onChange={
              setApprovalNotification
            }
          />
        </div>
      </div>

      {/* Tampilan */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Settings2
                size={18}
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Tampilan
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Sesuaikan preferensi tampilan aplikasi.
              </p>
            </div>
          </div>
        </div>

        <SettingToggle
          judul="Mode Ringkas"
          deskripsi="Gunakan jarak antar elemen yang lebih kecil pada halaman data."
          aktif={
            compactMode
          }
          onChange={
            setCompactMode
          }
        />
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
            <LockKeyhole
              size={19}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Keamanan Akun
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Sistem menggunakan autentikasi OTP simulasi untuk
              kebutuhan portofolio. Pada implementasi produksi,
              proses autentikasi harus menggunakan layanan OTP dan
              backend yang aman.
            </p>
          </div>
        </div>
      </div>

      {/* Admin only */}
      {isAdmin && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                <ShieldCheck
                  size={18}
                />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Informasi Sistem
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Informasi teknis Sistem Manajemen Kepegawaian.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Versi"
              value="1.0.0"
            />

            <InfoCard
              label="Penyimpanan"
              value="LocalStorage"
            />

            <InfoCard
              label="Frontend"
              value="React + TypeScript"
            />

            <InfoCard
              label="Status Sistem"
              value="Aktif"
            />
          </div>

          <div className="border-t border-slate-100 p-6">
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <Database
                size={19}
                className="mt-0.5 shrink-0 text-slate-600"
              />

              <p className="text-sm leading-6 text-slate-500">
                Data aplikasi portofolio ini disimpan melalui
                LocalStorage browser. Data produksi nantinya dapat
                dipindahkan ke API dan database backend.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingToggle({
  judul,
  deskripsi,
  aktif,
  onChange,
}: {
  judul: string
  deskripsi: string
  aktif: boolean
  onChange: (
    value: boolean
  ) => void
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {judul}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {deskripsi}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!aktif)
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          aktif
            ? 'bg-slate-950'
            : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            aktif
              ? 'left-6'
              : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  )
}