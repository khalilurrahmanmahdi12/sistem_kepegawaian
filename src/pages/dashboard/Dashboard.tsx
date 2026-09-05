import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileClock,
  UserCheck,
  Users,
} from 'lucide-react'

import { useNavigate } from 'react-router'

import AttendanceChart from '../../components/charts/AttendanceChart'
import EmployeeStatusChart from '../../components/charts/EmployeeStatusChart'
import StatCard from '../../components/ui/StatCard'

import { useAuth } from '../../context/AuthContext'
import { useLeave } from '../../context/LeaveContext'
import { useOvertime } from '../../context/OvertimeContext'

import {
  pendingApprovals,
  recentActivities,
} from '../../data/dashboard'

export default function Dashboard() {
  const { user } = useAuth()

  const { getSaldoCuti } = useLeave()

  const {
    getTotalLemburMenit,
  } = useOvertime()

  const navigate = useNavigate()

  if (!user) {
    return null
  }

  const isAdmin =
    user.role === 'Administrator'

  const isHR =
    user.role === 'HR'

  const isManager =
    user.role === 'Manager'

  const isEmployee =
    user.role === 'Karyawan'

  const tampilkanDashboardManajemen =
    isAdmin || isHR || isManager

  /*
   * Akun demo Karyawan:
   * Andi Saputra = EMP-001
   */
  const employeeId =
    isEmployee
      ? 'EMP-001'
      : String(user.id)

  /*
   * SALDO CUTI
   */
  const saldoCuti =
    getSaldoCuti(employeeId)

  /*
   * TOTAL LEMBUR
   * Hanya lembur berstatus Disetujui
   * yang dihitung oleh OvertimeContext.
   */
  const totalLemburMenit =
    getTotalLemburMenit(
      employeeId
    )

  const jamLembur =
    Math.floor(
      totalLemburMenit / 60
    )

  const menitLembur =
    totalLemburMenit % 60

  const totalLemburText =
    jamLembur > 0 &&
    menitLembur > 0
      ? `${jamLembur} Jam ${menitLembur} Menit`
      : jamLembur > 0
        ? `${jamLembur} Jam`
        : `${menitLembur} Menit`

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dasbor
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEmployee
              ? 'Ringkasan aktivitas dan informasi kepegawaian Anda.'
              : 'Pantau aktivitas dan kondisi kepegawaian perusahaan.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
          <span className="font-medium text-slate-900">
            Jumat, 5 September 2026
          </span>
        </div>
      </div>

      {/* ==========================================
          DASHBOARD ADMIN / HR / MANAGER
      ========================================== */}

      {tampilkanDashboardManajemen && (
        <>
          {/* STATISTIK */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              judul="Total Karyawan"
              nilai="128"
              keterangan="dibanding bulan lalu"
              perubahan="+4"
              icon={Users}
            />

            <StatCard
              judul="Hadir Hari Ini"
              nilai="112"
              keterangan="87,5% tingkat kehadiran"
              perubahan="+2,4%"
              icon={UserCheck}
            />

            <StatCard
              judul="Terlambat"
              nilai="8"
              keterangan="karyawan hari ini"
              perubahan="-3"
              positif
              icon={Clock3}
            />

            <StatCard
              judul="Sedang Cuti"
              nilai="6"
              keterangan="karyawan aktif cuti"
              icon={CalendarDays}
            />
          </div>

          {/* GRAFIK */}
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-6">
                <h2 className="font-semibold text-slate-900">
                  Tren Kehadiran
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Data kehadiran karyawan dalam 7 hari terakhir.
                </p>
              </div>

              <AttendanceChart />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Status Karyawan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Komposisi berdasarkan status kerja.
                </p>
              </div>

              <EmployeeStatusChart />
            </div>
          </div>

          {/* PERSETUJUAN DAN AKTIVITAS */}
          <div className="grid gap-6 xl:grid-cols-5">
            {/* MENUNGGU PERSETUJUAN */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-3">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Menunggu Persetujuan
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Pengajuan terbaru yang memerlukan tindakan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/persetujuan')
                  }
                  className="flex items-center gap-1 text-sm font-semibold text-slate-800 transition hover:text-slate-950"
                >
                  Lihat Semua

                  <ArrowRight
                    size={16}
                  />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {pendingApprovals.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.nama}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.jenis} •{' '}
                          {item.durasi}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">
                          {
                            item.tanggal
                          }
                        </span>

                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          Menunggu
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* AKTIVITAS TERBARU */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="font-semibold text-slate-900">
                  Aktivitas Terbaru
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Aktivitas terbaru dalam sistem.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {recentActivities.map(
                  (activity) => (
                    <div
                      key={
                        activity.id
                      }
                      className="px-6 py-4"
                    >
                      <div className="flex gap-3">
                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-800" />

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {
                              activity.judul
                            }
                          </p>

                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {
                              activity.deskripsi
                            }
                          </p>

                          <p className="mt-2 text-[11px] text-slate-400">
                            {
                              activity.waktu
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==========================================
          DASHBOARD KARYAWAN
      ========================================== */}

      {isEmployee && (
        <>
          {/* STATISTIK KARYAWAN */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              judul="Kehadiran Bulan Ini"
              nilai="20 Hari"
              keterangan="dari 22 hari kerja"
              icon={UserCheck}
            />

            <StatCard
              judul="Sisa Cuti"
              nilai={`${saldoCuti} Hari`}
              keterangan="cuti tahunan tersedia"
              icon={CalendarDays}
            />

            <StatCard
              judul="Total Lembur"
              nilai={
                totalLemburText
              }
              keterangan="lembur yang telah disetujui"
              icon={Clock3}
            />

            <StatCard
              judul="Pengajuan Aktif"
              nilai="1"
              keterangan="menunggu persetujuan"
              icon={FileClock}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {/* ABSENSI HARI INI */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Absensi Hari Ini
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Jumat, 5 September 2026
                  </p>
                </div>

                <CheckCircle2 className="text-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* JAM MASUK */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Jam Masuk
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    07:58
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
                    Tepat Waktu
                  </span>
                </div>

                {/* JAM PULANG */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Jam Pulang
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    -
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600">
                    Belum Absen
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('/absensi')
                }
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Buka Halaman Absensi
              </button>
            </div>

            {/* PENGAJUAN SAYA */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Pengajuan Saya
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Status pengajuan terbaru.
              </p>

              <div className="mt-5 space-y-3">
                {/* CUTI */}
                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Cuti Tahunan
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      12 - 13 Sep
                      2026
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    Menunggu
                  </span>
                </div>

                {/* LEMBUR */}
                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Lembur
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      2 Sep 2026
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Disetujui
                  </span>
                </div>

                {/* IZIN */}
                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Izin
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      25 Agu 2026
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Disetujui
                  </span>
                </div>
              </div>
            </div>

            {/* INFORMASI SAYA */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Informasi Saya
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Informasi pekerjaan Anda.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500">
                    Nama
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {user.nama}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Jabatan
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {
                      user.jabatan
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Divisi
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {
                      user.divisi
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Status Karyawan
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}