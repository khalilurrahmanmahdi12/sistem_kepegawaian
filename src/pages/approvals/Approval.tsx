import {
 
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Search,
  XCircle,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { toast } from 'sonner'

import ApprovalReviewModal, {
  type ApprovalType,
  type UnifiedApproval,
} from '../../components/approvals/ApprovalReviewModal'

import { useAuth } from '../../context/AuthContext'
import { useLeave } from '../../context/LeaveContext'
import { usePermission } from '../../context/PermissionContext'
import { useOvertime } from '../../context/OvertimeContext'

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

function formatDurasiMenit(
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

export default function Approval() {
  const { user } =
    useAuth()

  const {
    leaveRequests,
    prosesPengajuanCuti,
  } = useLeave()

  const {
    permissions,
    prosesIzin,
  } = usePermission()

  const {
    overtimeRequests,
    prosesLembur,
  } = useOvertime()

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    filterJenis,
    setFilterJenis,
  ] = useState<
    'Semua' | ApprovalType
  >('Semua')

  const [
    filterStatus,
    setFilterStatus,
  ] = useState('Menunggu')

  const [
    selectedRequest,
    setSelectedRequest,
  ] =
    useState<UnifiedApproval | null>(
      null
    )

  if (!user) {
    return null
  }

  const canApprove =
    user.role ===
      'Administrator' ||
    user.role === 'HR' ||
    user.role ===
      'Manager'

  /*
   * Satukan Cuti + Izin + Lembur
   */
  const semuaPengajuan =
    useMemo<
      UnifiedApproval[]
    >(() => {
      const cuti: UnifiedApproval[] =
        leaveRequests.map(
          (item) => ({
            id: `CUTI-${item.id}`,
            sourceId: item.id,

            jenis: 'Cuti',

            nama: item.nama,
            nip: item.nip,
            divisi: item.divisi,

            tanggal:
              item.tanggalMulai,

            periode: `${formatTanggal(
              item.tanggalMulai
            )} - ${formatTanggal(
              item.tanggalSelesai
            )}`,

            durasi: `${item.jumlahHari} Hari`,

            alasan: `${item.jenisCuti} • ${item.alasan}`,

            status: item.status,

            tanggalPengajuan:
              item.tanggalPengajuan,

            catatan:
              item.catatanPersetujuan,

            diprosesOleh:
              item.diprosesOleh,
          })
        )

      const izin: UnifiedApproval[] =
        permissions.map(
          (item) => ({
            id: `IZIN-${item.id}`,
            sourceId: item.id,

            jenis: 'Izin',

            nama: item.nama,
            nip: item.nip,
            divisi: item.divisi,

            tanggal:
              item.tanggal,

            periode: `${item.jamMulai} - ${item.jamSelesai}`,

            durasi:
              formatDurasiMenit(
                item.durasiMenit
              ),

            alasan: `${item.jenisIzin} • ${item.alasan}`,

            status: item.status,

            tanggalPengajuan:
              item.tanggalPengajuan,

            catatan:
              item.catatanPersetujuan,

            diprosesOleh:
              item.diprosesOleh,
          })
        )

      const lembur: UnifiedApproval[] =
        overtimeRequests.map(
          (item) => ({
            id: `LEMBUR-${item.id}`,
            sourceId: item.id,

            jenis: 'Lembur',

            nama: item.nama,
            nip: item.nip,
            divisi: item.divisi,

            tanggal:
              item.tanggal,

            periode: `${item.jamMulai} - ${item.jamSelesai}`,

            durasi:
              formatDurasiMenit(
                item.durasiMenit
              ),

            alasan:
              item.alasan,

            status: item.status,

            tanggalPengajuan:
              item.tanggalPengajuan,

            catatan:
              item.catatanPersetujuan,

            diprosesOleh:
              item.diprosesOleh,
          })
        )

      return [
        ...cuti,
        ...izin,
        ...lembur,
      ].sort(
        (a, b) =>
          b.tanggalPengajuan.localeCompare(
            a.tanggalPengajuan
          )
      )
    }, [
      leaveRequests,
      permissions,
      overtimeRequests,
    ])

  /*
   * Filter
   */
  const filteredRequests =
    useMemo(() => {
      const keyword =
        search
          .toLowerCase()
          .trim()

      return semuaPengajuan.filter(
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

          const cocokJenis =
            filterJenis ===
              'Semua' ||
            item.jenis ===
              filterJenis

          const cocokStatus =
            filterStatus ===
              'Semua' ||
            item.status ===
              filterStatus

          return (
            cocokSearch &&
            cocokJenis &&
            cocokStatus
          )
        }
      )
    }, [
      semuaPengajuan,
      search,
      filterJenis,
      filterStatus,
    ])

  /*
   * Statistik
   */
  const totalMenunggu =
    semuaPengajuan.filter(
      (item) =>
        item.status ===
        'Menunggu'
    ).length

  const totalDisetujui =
    semuaPengajuan.filter(
      (item) =>
        item.status ===
        'Disetujui'
    ).length

  const totalDitolak =
    semuaPengajuan.filter(
      (item) =>
        item.status ===
        'Ditolak'
    ).length

  const handleApprove = (
    catatan: string
  ) => {
    if (
      !selectedRequest
    ) {
      return
    }

    let hasil:
      | {
          berhasil: boolean
          pesan: string
        }
      | undefined

    if (
      selectedRequest.jenis ===
      'Cuti'
    ) {
      hasil =
        prosesPengajuanCuti(
          selectedRequest.sourceId,
          'Disetujui',
          catatan,
          user.nama
        )
    }

    if (
      selectedRequest.jenis ===
      'Izin'
    ) {
      hasil =
        prosesIzin(
          selectedRequest.sourceId,
          'Disetujui',
          catatan,
          user.nama
        )
    }

    if (
      selectedRequest.jenis ===
      'Lembur'
    ) {
      hasil =
        prosesLembur(
          selectedRequest.sourceId,
          'Disetujui',
          catatan,
          user.nama
        )
    }

    if (!hasil) {
      return
    }

    if (
      hasil.berhasil
    ) {
      toast.success(
        hasil.pesan
      )

      setSelectedRequest(
        null
      )
    } else {
      toast.error(
        hasil.pesan
      )
    }
  }

  const handleReject = (
    catatan: string
  ) => {
    if (
      !selectedRequest
    ) {
      return
    }

    let hasil:
      | {
          berhasil: boolean
          pesan: string
        }
      | undefined

    if (
      selectedRequest.jenis ===
      'Cuti'
    ) {
      hasil =
        prosesPengajuanCuti(
          selectedRequest.sourceId,
          'Ditolak',
          catatan,
          user.nama
        )
    }

    if (
      selectedRequest.jenis ===
      'Izin'
    ) {
      hasil =
        prosesIzin(
          selectedRequest.sourceId,
          'Ditolak',
          catatan,
          user.nama
        )
    }

    if (
      selectedRequest.jenis ===
      'Lembur'
    ) {
      hasil =
        prosesLembur(
          selectedRequest.sourceId,
          'Ditolak',
          catatan,
          user.nama
        )
    }

    if (!hasil) {
      return
    }

    if (
      hasil.berhasil
    ) {
      toast.success(
        hasil.pesan
      )

      setSelectedRequest(
        null
      )
    } else {
      toast.error(
        hasil.pesan
      )
    }
  }

  /*
   * Proteksi tambahan tampilan.
   */
  if (!canApprove) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <ClipboardCheck
              size={26}
            />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Akses Dibatasi
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Halaman persetujuan hanya dapat diakses oleh Administrator, HR, dan Manager.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Persetujuan
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Tinjau pengajuan Cuti, Izin, dan Lembur karyawan dalam satu halaman.
        </p>
      </div>

      {/* Statistik */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatBox
          judul="Total Pengajuan"
          nilai={
            semuaPengajuan.length
          }
          icon={
            ClipboardCheck
          }
        />

        <StatBox
          judul="Menunggu"
          nilai={
            totalMenunggu
          }
          icon={Clock3}
        />

        <StatBox
          judul="Disetujui"
          nilai={
            totalDisetujui
          }
          icon={
            CheckCircle2
          }
        />

        <StatBox
          judul="Ditolak"
          nilai={totalDitolak}
          icon={XCircle}
        />
      </div>

      {/* Tabel */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Filter */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Cari nama, NIP, atau divisi..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-900"
            />
          </div>

          <select
            value={filterJenis}
            onChange={(event) =>
              setFilterJenis(
                event.target
                  .value as
                  | 'Semua'
                  | ApprovalType
              )
            }
            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-900"
          >
            <option value="Semua">
              Semua Jenis
            </option>

            <option value="Cuti">
              Cuti
            </option>

            <option value="Izin">
              Izin
            </option>

            <option value="Lembur">
              Lembur
            </option>
          </select>

          <select
            value={
              filterStatus
            }
            onChange={(event) =>
              setFilterStatus(
                event.target.value
              )
            }
            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-900"
          >
            <option value="Semua">
              Semua Status
            </option>

            <option value="Menunggu">
              Menunggu
            </option>

            <option value="Disetujui">
              Disetujui
            </option>

            <option value="Ditolak">
              Ditolak
            </option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">
                  Karyawan
                </th>

                <th className="px-5 py-4">
                  Jenis
                </th>

                <th className="px-5 py-4">
                  Tanggal
                </th>

                <th className="px-5 py-4">
                  Durasi
                </th>

                <th className="px-5 py-4">
                  Pengajuan
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length >
              0 ? (
                filteredRequests.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Karyawan */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {
                            item.nama
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            item.nip
                          }{' '}
                          •{' '}
                          {
                            item.divisi
                          }
                        </p>
                      </td>

                      {/* Jenis */}
                      <td className="px-5 py-4">
                        <JenisBadge
                          jenis={
                            item.jenis
                          }
                        />
                      </td>

                      {/* Tanggal */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {formatTanggal(
                            item.tanggal
                          )}
                        </p>

                        <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                          {
                            item.periode
                          }
                        </p>
                      </td>

                      {/* Durasi */}
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {
                          item.durasi
                        }
                      </td>

                      {/* Tanggal pengajuan */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatTanggal(
                          item.tanggalPengajuan
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            item.status
                          }
                        />
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-4 text-right">
                        {item.status ===
                        'Menunggu' ? (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRequest(
                                item
                              )
                            }
                            className="rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            Tinjau
                          </button>
                        ) : (
                          <div>
                            <p className="text-xs font-medium text-slate-500">
                              Sudah diproses
                            </p>

                            {item.diprosesOleh && (
                              <p className="mt-1 text-[11px] text-slate-400">
                                oleh{' '}
                                {
                                  item.diprosesOleh
                                }
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center"
                  >
                    <ClipboardCheck
                      size={38}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Tidak ada pengajuan ditemukan.
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Coba ubah pencarian atau filter.
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
                filteredRequests.length
              }
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-slate-700">
              {
                semuaPengajuan.length
              }
            </span>{' '}
            pengajuan
          </p>
        </div>
      </div>

      <ApprovalReviewModal
        request={
          selectedRequest
        }
        onClose={() =>
          setSelectedRequest(
            null
          )
        }
        onApprove={
          handleApprove
        }
        onReject={
          handleReject
        }
      />
    </div>
  )
}

function StatBox({
  judul,
  nilai,
  icon: Icon,
}: {
  judul: string
  nilai: number
  icon: typeof Clock3
}) {
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

function JenisBadge({
  jenis,
}: {
  jenis: ApprovalType
}) {
  if (jenis === 'Cuti') {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
        Cuti
      </span>
    )
  }

  if (jenis === 'Izin') {
    return (
      <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
        Izin
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
      Lembur
    </span>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  if (
    status ===
    'Disetujui'
  ) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Disetujui
      </span>
    )
  }

  if (
    status ===
    'Ditolak'
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        Ditolak
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      Menunggu
    </span>
  )
}