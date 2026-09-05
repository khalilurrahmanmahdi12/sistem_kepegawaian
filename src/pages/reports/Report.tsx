import {
  BarChart3,
  CalendarDays,
  Clock3,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Users,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { toast } from 'sonner'

import { useAuth } from '../../context/AuthContext'
import { useEmployees } from '../../context/EmployeeContext'
import { useAttendance } from '../../context/AttendanceContext'
import { useLeave } from '../../context/LeaveContext'
import { usePermission } from '../../context/PermissionContext'
import { useOvertime } from '../../context/OvertimeContext'

import {
  exportReportExcel,
  exportReportPdf,
  type ReportColumn,
} from '../../utils/reportExport'

type ReportType =
  | 'Karyawan'
  | 'Absensi'
  | 'Cuti'
  | 'Izin'
  | 'Lembur'

interface ReportData {
  columns: ReportColumn[]

  rows: Record<
    string,
    string | number
  >[]
}

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

function formatDurasi(
  menit: number
) {
  const jam =
    Math.floor(
      menit / 60
    )

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

function dalamPeriode(
  tanggal: string,
  mulai: string,
  selesai: string
) {
  if (
    mulai &&
    tanggal < mulai
  ) {
    return false
  }

  if (
    selesai &&
    tanggal > selesai
  ) {
    return false
  }

  return true
}

export default function Report() {
  const { user } =
    useAuth()

  const { employees } =
    useEmployees()

  const { attendance } =
    useAttendance()

  const {
    leaveRequests,
  } = useLeave()

  const {
    permissions,
  } = usePermission()

  const {
    overtimeRequests,
  } = useOvertime()

  const [
    jenisLaporan,
    setJenisLaporan,
  ] =
    useState<ReportType>(
      'Karyawan'
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
    search,
    setSearch,
  ] = useState('')

  if (!user) {
    return null
  }

  const canAccess =
    user.role ===
      'Administrator' ||
    user.role === 'HR' ||
    user.role ===
      'Manager'

  const reportData =
    useMemo<ReportData>(() => {
      const keyword =
        search
          .toLowerCase()
          .trim()

      /*
       * LAPORAN KARYAWAN
       */
      if (
        jenisLaporan ===
        'Karyawan'
      ) {
        const columns: ReportColumn[] =
          [
            {
              key: 'nip',
              label: 'NIP',
            },
            {
              key: 'nama',
              label: 'Nama',
            },
            {
              key: 'divisi',
              label: 'Divisi',
            },
            {
              key: 'jabatan',
              label: 'Jabatan',
            },
            {
              key: 'statusKerja',
              label:
                'Status Kerja',
            },
            {
              key: 'status',
              label:
                'Status Karyawan',
            },
            {
              key: 'tanggalMasuk',
              label:
                'Tanggal Masuk',
            },
          ]

        const rows =
          employees
            .filter(
              (item) =>
                dalamPeriode(
                  item.tanggalMasuk,
                  tanggalMulai,
                  tanggalSelesai
                )
            )
            .filter(
              (item) =>
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
                  ) ||
                item.jabatan
                  .toLowerCase()
                  .includes(
                    keyword
                  )
            )
            .map(
              (item) => ({
                nip:
                  item.nip,

                nama:
                  item.nama,

                divisi:
                  item.divisi,

                jabatan:
                  item.jabatan,

                statusKerja:
                  item.statusKerja,

                status:
                  item.status,

                tanggalMasuk:
                  formatTanggal(
                    item.tanggalMasuk
                  ),
              })
            )

        return {
          columns,
          rows,
        }
      }

      /*
       * LAPORAN ABSENSI
       */
      if (
        jenisLaporan ===
        'Absensi'
      ) {
        const columns: ReportColumn[] =
          [
            {
              key: 'tanggal',
              label: 'Tanggal',
            },
            {
              key: 'nip',
              label: 'NIP',
            },
            {
              key: 'nama',
              label: 'Nama',
            },
            {
              key: 'divisi',
              label: 'Divisi',
            },
            {
              key: 'jamMasuk',
              label:
                'Jam Masuk',
            },
            {
              key: 'jamPulang',
              label:
                'Jam Pulang',
            },
            {
              key: 'status',
              label: 'Status',
            },
          ]

        const rows =
          attendance
            .filter(
              (item) =>
                dalamPeriode(
                  item.tanggal,
                  tanggalMulai,
                  tanggalSelesai
                )
            )
            .filter(
              (item) =>
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
            )
            .map(
              (item) => ({
                tanggal:
                  formatTanggal(
                    item.tanggal
                  ),

                nip:
                  item.nip,

                nama:
                  item.nama,

                divisi:
                  item.divisi,

                jamMasuk:
                  item.jamMasuk ??
                  '-',

                jamPulang:
                  item.jamPulang ??
                  '-',

                status:
                  item.status,
              })
            )

        return {
          columns,
          rows,
        }
      }

      /*
       * LAPORAN CUTI
       */
      if (
        jenisLaporan ===
        'Cuti'
      ) {
        const columns: ReportColumn[] =
          [
            {
              key: 'tanggalPengajuan',
              label:
                'Tanggal Pengajuan',
            },
            {
              key: 'nip',
              label: 'NIP',
            },
            {
              key: 'nama',
              label: 'Nama',
            },
            {
              key: 'divisi',
              label: 'Divisi',
            },
            {
              key: 'jenis',
              label:
                'Jenis Cuti',
            },
            {
              key: 'periode',
              label: 'Periode',
            },
            {
              key: 'durasi',
              label: 'Durasi',
            },
            {
              key: 'status',
              label: 'Status',
            },
          ]

        const rows =
          leaveRequests
            .filter(
              (item) =>
                dalamPeriode(
                  item.tanggalPengajuan,
                  tanggalMulai,
                  tanggalSelesai
                )
            )
            .filter(
              (item) =>
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
            )
            .map(
              (item) => ({
                tanggalPengajuan:
                  formatTanggal(
                    item.tanggalPengajuan
                  ),

                nip:
                  item.nip,

                nama:
                  item.nama,

                divisi:
                  item.divisi,

                jenis:
                  item.jenisCuti,

                periode: `${formatTanggal(
                  item.tanggalMulai
                )} - ${formatTanggal(
                  item.tanggalSelesai
                )}`,

                durasi: `${item.jumlahHari} Hari`,

                status:
                  item.status,
              })
            )

        return {
          columns,
          rows,
        }
      }

      /*
       * LAPORAN IZIN
       */
      if (
        jenisLaporan ===
        'Izin'
      ) {
        const columns: ReportColumn[] =
          [
            {
              key: 'tanggalPengajuan',
              label:
                'Tanggal Pengajuan',
            },
            {
              key: 'nip',
              label: 'NIP',
            },
            {
              key: 'nama',
              label: 'Nama',
            },
            {
              key: 'jenis',
              label:
                'Jenis Izin',
            },
            {
              key: 'tanggal',
              label:
                'Tanggal Izin',
            },
            {
              key: 'waktu',
              label: 'Waktu',
            },
            {
              key: 'durasi',
              label: 'Durasi',
            },
            {
              key: 'status',
              label: 'Status',
            },
          ]

        const rows =
          permissions
            .filter(
              (item) =>
                dalamPeriode(
                  item.tanggalPengajuan,
                  tanggalMulai,
                  tanggalSelesai
                )
            )
            .filter(
              (item) =>
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
                item.jenisIzin
                  .toLowerCase()
                  .includes(
                    keyword
                  )
            )
            .map(
              (item) => ({
                tanggalPengajuan:
                  formatTanggal(
                    item.tanggalPengajuan
                  ),

                nip:
                  item.nip,

                nama:
                  item.nama,

                jenis:
                  item.jenisIzin,

                tanggal:
                  formatTanggal(
                    item.tanggal
                  ),

                waktu: `${item.jamMulai} - ${item.jamSelesai}`,

                durasi:
                  formatDurasi(
                    item.durasiMenit
                  ),

                status:
                  item.status,
              })
            )

        return {
          columns,
          rows,
        }
      }

      /*
       * LAPORAN LEMBUR
       */
      const columns: ReportColumn[] =
        [
          {
            key: 'tanggalPengajuan',
            label:
              'Tanggal Pengajuan',
          },
          {
            key: 'nip',
            label: 'NIP',
          },
          {
            key: 'nama',
            label: 'Nama',
          },
          {
            key: 'divisi',
            label: 'Divisi',
          },
          {
            key: 'tanggal',
            label:
              'Tanggal Lembur',
          },
          {
            key: 'waktu',
            label: 'Waktu',
          },
          {
            key: 'durasi',
            label: 'Durasi',
          },
          {
            key: 'status',
            label: 'Status',
          },
        ]

      const rows =
        overtimeRequests
          .filter(
            (item) =>
              dalamPeriode(
                item.tanggalPengajuan,
                tanggalMulai,
                tanggalSelesai
              )
          )
          .filter(
            (item) =>
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
          )
          .map(
            (item) => ({
              tanggalPengajuan:
                formatTanggal(
                  item.tanggalPengajuan
                ),

              nip:
                item.nip,

              nama:
                item.nama,

              divisi:
                item.divisi,

              tanggal:
                formatTanggal(
                  item.tanggal
                ),

              waktu: `${item.jamMulai} - ${item.jamSelesai}`,

              durasi:
                formatDurasi(
                  item.durasiMenit
                ),

              status:
                item.status,
            })
          )

      return {
        columns,
        rows,
      }
    }, [
      jenisLaporan,
      tanggalMulai,
      tanggalSelesai,
      search,
      employees,
      attendance,
      leaveRequests,
      permissions,
      overtimeRequests,
    ])

  if (!canAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <BarChart3 size={26} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Akses Dibatasi
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Laporan hanya dapat diakses oleh Administrator, HR, dan Manager.
          </p>
        </div>
      </div>
    )
  }

  const periodeText =
    tanggalMulai &&
    tanggalSelesai
      ? `${formatTanggal(
          tanggalMulai
        )} - ${formatTanggal(
          tanggalSelesai
        )}`
      : tanggalMulai
        ? `Mulai ${formatTanggal(
            tanggalMulai
          )}`
        : tanggalSelesai
          ? `Sampai ${formatTanggal(
              tanggalSelesai
            )}`
          : 'Semua Periode'

  const handleExcel =
    () => {
      if (
        reportData.rows
          .length === 0
      ) {
        toast.error(
          'Tidak ada data untuk diekspor.'
        )

        return
      }

      exportReportExcel({
        judul: `Laporan ${jenisLaporan}`,

        namaFile: `laporan-${jenisLaporan.toLowerCase()}`,

        columns:
          reportData.columns,

        rows:
          reportData.rows,
      })

      toast.success(
        'Laporan Excel berhasil dibuat.'
      )
    }

  const handlePdf =
    () => {
      if (
        reportData.rows
          .length === 0
      ) {
        toast.error(
          'Tidak ada data untuk diekspor.'
        )

        return
      }

      exportReportPdf({
        judul: `Laporan ${jenisLaporan}`,

        periode:
          periodeText,

        namaFile: `laporan-${jenisLaporan.toLowerCase()}`,

        columns:
          reportData.columns,

        rows:
          reportData.rows,
      })

      toast.success(
        'Laporan PDF berhasil dibuat.'
      )
    }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laporan
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Buat dan ekspor laporan kepegawaian dalam format Excel atau PDF.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={
              handleExcel
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FileSpreadsheet
              size={18}
            />

            Export Excel
          </button>

          <button
            type="button"
            onClick={
              handlePdf
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <FileText
              size={18}
            />

            Export PDF
          </button>
        </div>
      </div>

      {/* PILIH LAPORAN */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <ReportTypeCard
          label="Karyawan"
          icon={Users}
          aktif={
            jenisLaporan ===
            'Karyawan'
          }
          onClick={() =>
            setJenisLaporan(
              'Karyawan'
            )
          }
        />

        <ReportTypeCard
          label="Absensi"
          icon={Clock3}
          aktif={
            jenisLaporan ===
            'Absensi'
          }
          onClick={() =>
            setJenisLaporan(
              'Absensi'
            )
          }
        />

        <ReportTypeCard
          label="Cuti"
          icon={
            CalendarDays
          }
          aktif={
            jenisLaporan ===
            'Cuti'
          }
          onClick={() =>
            setJenisLaporan(
              'Cuti'
            )
          }
        />

        <ReportTypeCard
          label="Izin"
          icon={FileText}
          aktif={
            jenisLaporan ===
            'Izin'
          }
          onClick={() =>
            setJenisLaporan(
              'Izin'
            )
          }
        />

        <ReportTypeCard
          label="Lembur"
          icon={Clock3}
          aktif={
            jenisLaporan ===
            'Lembur'
          }
          onClick={() =>
            setJenisLaporan(
              'Lembur'
            )
          }
        />
      </div>

      {/* FILTER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-4">
          <div className="relative xl:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              placeholder="Cari nama, NIP, divisi..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
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
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <input
              type="date"
              value={
                tanggalSelesai
              }
              min={
                tanggalMulai
              }
              onChange={(
                event
              ) =>
                setTanggalSelesai(
                  event.target
                    .value
                )
              }
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">
            Periode:{' '}
            <span className="font-semibold text-slate-700">
              {
                periodeText
              }
            </span>
          </p>

          {(tanggalMulai ||
            tanggalSelesai ||
            search) && (
            <button
              type="button"
              onClick={() => {
                setTanggalMulai(
                  ''
                )

                setTanggalSelesai(
                  ''
                )

                setSearch('')
              }}
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* PREVIEW */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">
              Laporan{' '}
              {
                jenisLaporan
              }
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Preview data sebelum diekspor.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
            <Download
              size={16}
              className="text-slate-500"
            />

            <span className="text-sm font-semibold text-slate-700">
              {
                reportData.rows
                  .length
              }{' '}
              Data
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">
                  No
                </th>

                {reportData.columns.map(
                  (column) => (
                    <th
                      key={
                        column.key
                      }
                      className="px-5 py-4"
                    >
                      {
                        column.label
                      }
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {reportData.rows
                .length > 0 ? (
                reportData.rows.map(
                  (
                    row,
                    index
                  ) => (
                    <tr
                      key={`${jenisLaporan}-${index}`}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {index +
                          1}
                      </td>

                      {reportData.columns.map(
                        (
                          column
                        ) => (
                          <td
                            key={
                              column.key
                            }
                            className="max-w-[260px] px-5 py-4 text-sm text-slate-700"
                          >
                            <span className="line-clamp-2">
                              {String(
                                row[
                                  column
                                    .key
                                ] ??
                                  '-'
                              )}
                            </span>
                          </td>
                        )
                      )}
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      reportData
                        .columns
                        .length +
                      1
                    }
                    className="px-6 py-16 text-center"
                  >
                    <FileText
                      size={38}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Tidak ada data ditemukan.
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Coba ubah periode atau pencarian.
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
                reportData.rows
                  .length
              }
            </span>{' '}
            data laporan{' '}
            {jenisLaporan.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  )
}

function ReportTypeCard({
  label,
  icon: Icon,
  aktif,
  onClick,
}: {
  label: ReportType
  icon: typeof Users
  aktif: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left shadow-sm transition ${
        aktif
          ? 'border-slate-950 bg-slate-950 text-white'
          : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          aktif
            ? 'bg-white/10 text-white'
            : 'bg-slate-100 text-slate-700'
        }`}
      >
        <Icon size={19} />
      </div>

      <p className="mt-4 text-sm font-semibold">
        Laporan {label}
      </p>
    </button>
  )
}