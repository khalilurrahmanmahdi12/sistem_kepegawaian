import {

  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  XCircle,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import {
  toast,
} from 'sonner'

import LeaveFormModal from '../../components/leave/LeaveFormModal'
import LeaveReviewModal from '../../components/leave/LeaveReviewModal'

import {
  useAuth,
} from '../../context/AuthContext'

import {
  useLeave,
} from '../../context/LeaveContext'

import type {
  LeaveRequest,
  LeaveType,
} from '../../types/leave'

function formatTanggal(
  tanggal: string
) {
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

export default function Leave() {
  const { user } =
    useAuth()

  const {
    leaveRequests,
    tambahPengajuanCuti,
    prosesPengajuanCuti,
    getSaldoCuti,
  } = useLeave()

  const [
    formTerbuka,
    setFormTerbuka,
  ] = useState(false)

  const [
    reviewRequest,
    setReviewRequest,
  ] =
    useState<LeaveRequest | null>(
      null
    )

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    filterStatus,
    setFilterStatus,
  ] = useState('Semua')

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

  const employeeId =
    isEmployee
      ? 'EMP-001'
      : String(user.id)

  const saldoCuti =
    getSaldoCuti(employeeId)

  const pengajuanSaya =
    useMemo(() => {
      return leaveRequests
        .filter(
          (item) =>
            item.employeeId ===
            employeeId
        )
        .sort(
          (a, b) =>
            b.tanggalPengajuan.localeCompare(
              a.tanggalPengajuan
            )
        )
    }, [
      leaveRequests,
      employeeId,
    ])

  const filteredRequests =
    useMemo(() => {
      const keyword =
        search
          .toLowerCase()
          .trim()

      return leaveRequests.filter(
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

          return (
            cocokSearch &&
            cocokStatus
          )
        }
      )
    }, [
      leaveRequests,
      search,
      filterStatus,
    ])

  const handleSubmit = (
    data: {
      jenisCuti: LeaveType
      tanggalMulai: string
      tanggalSelesai: string
      jumlahHari: number
      alasan: string
    }
  ) => {
    const hasil =
      tambahPengajuanCuti({
        employeeId,
        nama: user.nama,
        nip: 'KRY-2026-001',
        divisi: user.divisi,
        ...data,
      })

    if (
      hasil.berhasil
    ) {
      toast.success(
        hasil.pesan
      )

      setFormTerbuka(false)
    } else {
      toast.error(
        hasil.pesan
      )
    }
  }

  const handleApprove = (
    catatan: string
  ) => {
    if (!reviewRequest) {
      return
    }

    const hasil =
      prosesPengajuanCuti(
        reviewRequest.id,
        'Disetujui',
        catatan,
        user.nama
      )

    if (
      hasil.berhasil
    ) {
      toast.success(
        hasil.pesan
      )

      setReviewRequest(null)
    } else {
      toast.error(
        hasil.pesan
      )
    }
  }

  const handleReject = (
    catatan: string
  ) => {
    if (!reviewRequest) {
      return
    }

    const hasil =
      prosesPengajuanCuti(
        reviewRequest.id,
        'Ditolak',
        catatan,
        user.nama
      )

    if (
      hasil.berhasil
    ) {
      toast.success(
        hasil.pesan
      )

      setReviewRequest(null)
    } else {
      toast.error(
        hasil.pesan
      )
    }
  }

  const totalMenunggu =
    leaveRequests.filter(
      (item) =>
        item.status ===
        'Menunggu'
    ).length

  const totalDisetujui =
    leaveRequests.filter(
      (item) =>
        item.status ===
        'Disetujui'
    ).length

  const totalDitolak =
    leaveRequests.filter(
      (item) =>
        item.status ===
        'Ditolak'
    ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Cuti
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEmployee
              ? 'Ajukan cuti dan pantau status pengajuan Anda.'
              : 'Kelola dan tinjau pengajuan cuti karyawan.'}
          </p>
        </div>

        {isEmployee && (
          <button
            type="button"
            onClick={() =>
              setFormTerbuka(
                true
              )
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={18} />

            Ajukan Cuti
          </button>
        )}
      </div>

      {isEmployee && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              judul="Sisa Cuti Tahunan"
              nilai={`${saldoCuti} Hari`}
              icon={
                CalendarDays
              }
            />

            <StatCard
              judul="Menunggu"
              nilai={
                pengajuanSaya.filter(
                  (item) =>
                    item.status ===
                    'Menunggu'
                ).length
              }
              icon={Clock3}
            />

            <StatCard
              judul="Disetujui"
              nilai={
                pengajuanSaya.filter(
                  (item) =>
                    item.status ===
                    'Disetujui'
                ).length
              }
              icon={
                CheckCircle2
              }
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-900">
                Riwayat Pengajuan Cuti
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Riwayat pengajuan cuti Anda.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                    <th className="px-6 py-4">
                      Jenis Cuti
                    </th>

                    <th className="px-6 py-4">
                      Periode
                    </th>

                    <th className="px-6 py-4">
                      Durasi
                    </th>

                    <th className="px-6 py-4">
                      Tanggal Pengajuan
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {pengajuanSaya.length >
                  0 ? (
                    pengajuanSaya.map(
                      (item) => (
                        <tr
                          key={
                            item.id
                          }
                        >
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-slate-900">
                              {
                                item.jenisCuti
                              }
                            </p>

                            <p className="mt-1 max-w-xs text-xs text-slate-500">
                              {
                                item.alasan
                              }
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatTanggal(
                              item.tanggalMulai
                            )}
                            {' - '}
                            {formatTanggal(
                              item.tanggalSelesai
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {
                              item.jumlahHari
                            }{' '}
                            Hari
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatTanggal(
                              item.tanggalPengajuan
                            )}
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
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          5
                        }
                        className="px-6 py-14 text-center text-sm text-slate-500"
                      >
                        Belum ada pengajuan cuti.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isManagement && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              judul="Menunggu Persetujuan"
              nilai={
                totalMenunggu
              }
              icon={
                Clock3
              }
            />

            <StatCard
              judul="Disetujui"
              nilai={
                totalDisetujui
              }
              icon={
                CheckCircle2
              }
            />

            <StatCard
              judul="Ditolak"
              nilai={
                totalDitolak
              }
              icon={
                XCircle
              }
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row">
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
                  className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <select
                value={
                  filterStatus
                }
                onChange={(event) =>
                  setFilterStatus(
                    event.target.value
                  )
                }
                className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-900"
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

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                    <th className="px-5 py-4">
                      Karyawan
                    </th>

                    <th className="px-5 py-4">
                      Jenis Cuti
                    </th>

                    <th className="px-5 py-4">
                      Periode
                    </th>

                    <th className="px-5 py-4">
                      Durasi
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
                  {filteredRequests.map(
                    (item) => (
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
                            }{' '}
                            •{' '}
                            {
                              item.divisi
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {
                            item.jenisCuti
                          }
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatTanggal(
                            item.tanggalMulai
                          )}
                          {' - '}
                          {formatTanggal(
                            item.tanggalSelesai
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {
                            item.jumlahHari
                          }{' '}
                          Hari
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>

                        <td className="px-5 py-4 text-right">
                          {item.status ===
                          'Menunggu' ? (
                            <button
                              type="button"
                              onClick={() =>
                                setReviewRequest(
                                  item
                                )
                              }
                              className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                            >
                              Tinjau
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Sudah diproses
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <LeaveFormModal
        terbuka={formTerbuka}
        saldoCuti={saldoCuti}
        onClose={() =>
          setFormTerbuka(false)
        }
        onSubmit={
          handleSubmit
        }
      />

      <LeaveReviewModal
        request={
          reviewRequest
        }
        onClose={() =>
          setReviewRequest(null)
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

function StatCard({
  judul,
  nilai,
  icon: Icon,
}: {
  judul: string
  nilai: string | number
  icon: typeof CalendarDays
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
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
  if (
    status === 'Disetujui'
  ) {
    return (
      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Disetujui
      </span>
    )
  }

  if (
    status === 'Ditolak'
  ) {
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        Ditolak
      </span>
    )
  }

  return (
    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      Menunggu
    </span>
  )
}