import {
  BriefcaseBusiness,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import {
  useAuth,
} from '../../context/AuthContext'

export default function Profile() {
  const {
    user,
  } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Profil Saya
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Informasi akun dan pekerjaan Anda.
        </p>
      </div>

      {/* Profile Header */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 px-6 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
              <UserRound
                size={30}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                {user.nama}
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                {user.jabatan}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <ProfileItem
            icon={Mail}
            label="Email"
            value={user.email}
          />

          <ProfileItem
            icon={Phone}
            label="Nomor WhatsApp"
            value={user.whatsapp}
          />

          <ProfileItem
            icon={Building2}
            label="Divisi"
            value={user.divisi}
          />

          <ProfileItem
            icon={
              BriefcaseBusiness
            }
            label="Jabatan"
            value={user.jabatan}
          />

          <ProfileItem
            icon={ShieldCheck}
            label="Hak Akses"
            value={user.role}
          />

          <ProfileItem
            icon={UserRound}
            label="Status Akun"
            value="Aktif"
          />
        </div>
      </div>

      {/* Informasi */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Tentang Akun
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Akun ini digunakan untuk mengakses Sistem Manajemen
          Kepegawaian Digital berdasarkan hak akses yang telah
          diberikan.
        </p>

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Role: {user.role}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Menu dan fitur yang tersedia akan menyesuaikan dengan
            peran akun Anda.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail
  label: string
  value: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  )
}