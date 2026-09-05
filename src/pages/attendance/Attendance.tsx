import {
  CalendarDays,
  
  Clock3,
  LogIn,
  LogOut,
  Search,
  UserCheck,
  UserX,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import {
  toast,
} from 'sonner'

import {
  useAuth,
} from '../../context/AuthContext'

import {
  useAttendance,
} from '../../context/AttendanceContext'

function formatTanggal(
  tanggal: string
) {
  if (!tanggal) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ).format(
    new Date(
      `${tanggal}T00:00:00`
    )
  )
}

function getTanggalHariIni() {
  const now = new Date()

  const year =
    now.getFullYear()

  const month = String(
    now.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    now.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function Attendance() {
  const { user } =
    useAuth()

  const {
    attendance,
    checkIn,
    checkOut,
  } = useAttendance()

  const [search, setSearch] =
    useState('')

  const [
    filterStatus,
    setFilterStatus,
  ] = useState('Semua')

  const [
    filterTanggal,
    setFilterTanggal,
  ] = useState('')

  if (!user) {
    return null
  }

  const isEmployee =
    user.role === 'Karyawan'

  const isManagement =
    user.role ===
      'Administrator' ||
    user.role === 'HR' ||
    user.role === 'Manager'

  const tanggalHariIni =
    getTanggalHariIni()

  const absensiSayaHariIni =
    attendance.find(
      (item) =>
        item.nama ===
          user.nama &&
        item.tanggal ===
          tanggalHariIni
    )

  const handleCheckIn =
    () => {
      const hasil =
        checkIn({
          employeeId: String(
            user.id
          ),
          nama: user.nama,
          nip: `USER-${String(
            user.id
          ).padStart(
            3,
            '0'
          )}`,
          divisi:
            user.divisi,
        })

      if (
        hasil.berhasil
      ) {
        toast.success(
          hasil.pesan
        )
      } else {
        toast.error(
          hasil.pesan
        )
      }
    }

  const handleCheckOut =
    () => {
      const hasil =
        checkOut(
          String(user.id)
        )

      if (
        hasil.berhasil
      ) {
        toast.success(
          hasil.pesan
        )
      } else {
        toast.error(
          hasil.pesan
        )
      }
    }

  const filteredAttendance =
    useMemo(() => {
      const keyword =
        search
          .toLowerCase()
          .trim()

      return attendance.filter(
        (item) => {
          const cocokSearch =
            item.nama
              .toLowerCase()
              .includes(
                keyword
              ) ||
            item.nip
              .toLowerCase()
              .includes(
                keyword
              ) ||
            item.divisi
              .toLowerCase()
              .includes(
                keyword
              )

          const cocokStatus =
            filterStatus ===
              'Semua' ||
            item.status ===
              filterStatus

          const cocokTanggal =
            !filterTanggal ||
            item.tanggal ===
              filterTanggal

          return (
            cocokSearch &&
            cocokStatus &&
            cocokTanggal
          )
        }
      )
    }, [
      attendance,
      search,
      filterStatus,
      filterTanggal,
    ])

  const attendanceSaya =
    useMemo(() => {
      return attendance
        .filter(
          (item) =>
            item.nama ===
            user.nama
        )
        .sort(
          (a, b) =>
            b.tanggal.localeCompare(
              a.tanggal
            )
        )
    }, [
      attendance,
      user.nama,
    ])

  const totalHadir =
    attendance.filter(
      (item) =>
        item.status ===
        'Hadir'
    ).length

  const totalTerlambat =
    attendance.filter(
      (item) =>
        item.status ===
        'Terlambat'
    ).length

  const totalIzin =
    attendance.filter(
      (item) =>
        item.status ===
        'Izin'
    ).length

  const totalTidakHadir =
    attendance.filter(
      (item) =>
        item.status ===
        'Tidak Hadir'
    ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Absensi
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {isEmployee
            ? 'Kelola absensi masuk, pulang, dan lihat riwayat kehadiran Anda.'
            : 'Pantau dan kelola data kehadiran karyawan perusahaan.'}
        </p>
      </div>

      {/* =====================
          KARYAWAN
      ====================== */}

      {isEmployee && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Absensi hari ini */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Absensi Hari Ini
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Intl.DateTimeFormat(
                      'id-ID',
                      {
                        weekday:
                          'long',
                        day: 'numeric',
                        month:
                          'long',
                        year: 'numeric',
                      }
                    ).format(
                      new Date()
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  Jam Kerja
                  08:00 - 17:00
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <LogIn size={17} />
                    Jam Masuk
                  </div>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {absensiSayaHariIni
                      ?.jamMasuk ||
                      '--:--'}
                  </p>

                  {absensiSayaHariIni && (
                    <span
                      className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        absensiSayaHariIni.status ===
                        'Terlambat'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {
                        absensiSayaHariIni.status
                      }
                    </span>
                  )}
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <LogOut size={17} />
                    Jam Pulang
                  </div>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {absensiSayaHariIni
                      ?.jamPulang ||
                      '--:--'}
                  </p>

                  <p className="mt-3 text-xs text-slate-500">
                    {absensiSayaHariIni
                      ?.jamPulang
                      ? 'Absensi hari ini selesai.'
                      : 'Belum melakukan absensi pulang.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={Boolean(
                    absensiSayaHariIni
                  )}
                  onClick={
                    handleCheckIn
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <LogIn size={18} />
                  Check-in
                </button>

                <button
                  type="button"
                  disabled={
                    !absensiSayaHariIni ||
                    Boolean(
                      absensiSayaHariIni.jamPulang
                    )
                  }
                  onClick={
                    handleCheckOut
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <LogOut size={18} />
                  Check-out
                </button>
              </div>
            </div>

            {/* Informasi */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Informasi Absensi
              </h2>

              <div className="mt-5 space-y-5">
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
                    Divisi
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {user.divisi}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Jam Masuk
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    08:00
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Jam Pulang
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    17:00
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                  Absensi setelah
                  pukul 08:00 akan
                  otomatis dicatat
                  sebagai
                  <span className="font-semibold text-amber-700">
                    {' '}
                    Terlambat
                  </span>
                  .
                </div>
              </div>
            </div>
          </div>

          {/* Riwayat */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-900">
                Riwayat Absensi Saya
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Riwayat kehadiran terbaru Anda.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                    <th className="px-6 py-4">
                      Tanggal
                    </th>

                    <th className="px-6 py-4">
                      Jam Masuk
                    </th>

                    <th className="px-6 py-4">
                      Jam Pulang
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {attendanceSaya.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {formatTanggal(
                            item.tanggal
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.jamMasuk ||
                            '-'}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.jamPulang ||
                            '-'}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>
                      </tr>
                    )
                  )}

                  {attendanceSaya.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        Belum ada riwayat absensi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =====================
          MANAGEMENT
      ====================== */}

      {isManagement && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatBox
              judul="Hadir"
              nilai={
                totalHadir
              }
              icon={
                UserCheck
              }
            />

            <StatBox
              judul="Terlambat"
              nilai={
                totalTerlambat
              }
              icon={
                Clock3
              }
            />

            <StatBox
              judul="Izin"
              nilai={
                totalIzin
              }
              icon={
                CalendarDays
              }
            />

            <StatBox
              judul="Tidak Hadir"
              nilai={
                totalTidakHadir
              }
              icon={
                UserX
              }
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Filter */}
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 xl:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Cari nama, NIP, atau divisi..."
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-900"
                />
              </div>

              <input
                type="date"
                value={
                  filterTanggal
                }
                onChange={(
                  event
                ) =>
                  setFilterTanggal(
                    event
                      .target
                      .value
                  )
                }
                className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-900"
              />

              <select
                value={
                  filterStatus
                }
                onChange={(
                  event
                ) =>
                  setFilterStatus(
                    event
                      .target
                      .value
                  )
                }
                className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-900"
              >
                <option value="Semua">
                  Semua Status
                </option>

                <option value="Hadir">
                  Hadir
                </option>

                <option value="Terlambat">
                  Terlambat
                </option>

                <option value="Izin">
                  Izin
                </option>

                <option value="Tidak Hadir">
                  Tidak Hadir
                </option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">
                      Karyawan
                    </th>

                    <th className="px-5 py-4">
                      Divisi
                    </th>

                    <th className="px-5 py-4">
                      Tanggal
                    </th>

                    <th className="px-5 py-4">
                      Jam Masuk
                    </th>

                    <th className="px-5 py-4">
                      Jam Pulang
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAttendance.length >
                  0 ? (
                    filteredAttendance
                      .slice()
                      .sort(
                        (
                          a,
                          b
                        ) =>
                          b.tanggal.localeCompare(
                            a.tanggal
                          )
                      )
                      .map(
                        (
                          item
                        ) => (
                          <tr
                            key={
                              item.id
                            }
                            className="hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold text-slate-900">
                                {
                                  item.nama
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  item.nip
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {
                                item.divisi
                              }
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {formatTanggal(
                                item.tanggal
                              )}
                            </td>

                            <td className="px-5 py-4 text-sm font-medium text-slate-800">
                              {item.jamMasuk ||
                                '-'}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {item.jamPulang ||
                                '-'}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge
                                status={
                                  item.status
                                }
                              />
                            </td>
                          </tr>
                        )
                      )
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          6
                        }
                        className="px-5 py-16 text-center"
                      >
                        <Clock3
                          size={
                            36
                          }
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          Data absensi tidak ditemukan.
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Coba ubah filter atau pencarian.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <p className="text-sm text-slate-500">
                Menampilkan{' '}
                <span className="font-semibold text-slate-700">
                  {
                    filteredAttendance.length
                  }
                </span>{' '}
                data absensi
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface StatBoxProps {
  judul: string
  nilai: number
  icon: typeof UserCheck
}

function StatBox({
  judul,
  nilai,
  icon: Icon,
}: StatBoxProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {judul}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {nilai}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  let className =
    'bg-slate-100 text-slate-700'

  if (
    status === 'Hadir'
  ) {
    className =
      'bg-emerald-50 text-emerald-700'
  }

  if (
    status === 'Terlambat'
  ) {
    className =
      'bg-amber-50 text-amber-700'
  }

  if (
    status === 'Izin'
  ) {
    className =
      'bg-slate-100 text-slate-700'
  }

  if (
    status ===
    'Tidak Hadir'
  ) {
    className =
      'bg-red-50 text-red-700'
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  )
}