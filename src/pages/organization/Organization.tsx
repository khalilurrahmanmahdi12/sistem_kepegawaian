import {
  BriefcaseBusiness,
  Building2,
  Pencil,
  Plus,
  Search,
  Users,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { toast } from 'sonner'

import DivisionFormModal from '../../components/organization/DivisionFormModal'
import PositionFormModal from '../../components/organization/PositionFormModal'
import ConfirmModal from '../../components/ui/ConfirmModal'

import { useAuth } from '../../context/AuthContext'
import { useEmployees } from '../../context/EmployeeContext'
import { useOrganization } from '../../context/OrganizationContext'

import type {
  Division,
  Position,
} from '../../types/organization'

export default function Organization() {
  const { user } =
    useAuth()

  const { employees } =
    useEmployees()

  const {
    divisions,
    positions,

    tambahDivisi,
    editDivisi,
    ubahStatusDivisi,

    tambahJabatan,
    editJabatan,
    ubahStatusJabatan,

    getDivisionName,
  } = useOrganization()

  const [
    tab,
    setTab,
  ] =
    useState<
      'divisi' | 'jabatan'
    >('divisi')

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    divisionModal,
    setDivisionModal,
  ] = useState(false)

  const [
    positionModal,
    setPositionModal,
  ] = useState(false)

  const [
    selectedDivision,
    setSelectedDivision,
  ] =
    useState<Division | null>(
      null
    )

  const [
    selectedPosition,
    setSelectedPosition,
  ] =
    useState<Position | null>(
      null
    )

  const [
    confirmDivision,
    setConfirmDivision,
  ] =
    useState<Division | null>(
      null
    )

  const [
    confirmPosition,
    setConfirmPosition,
  ] =
    useState<Position | null>(
      null
    )

  if (!user) {
    return null
  }

  const canManage =
    user.role ===
      'Administrator' ||
    user.role === 'HR'

  const filteredDivisions =
    useMemo(() => {
      const keyword =
        search
          .toLowerCase()
          .trim()

      return divisions.filter(
        (item) =>
          item.nama
            .toLowerCase()
            .includes(
              keyword
            ) ||
          item.kode
            .toLowerCase()
            .includes(
              keyword
            )
      )
    }, [
      divisions,
      search,
    ])

  const filteredPositions =
    useMemo(() => {
      const keyword =
        search
          .toLowerCase()
          .trim()

      return positions.filter(
        (item) => {
          const namaDivisi =
            getDivisionName(
              item.divisionId
            )

          return (
            item.nama
              .toLowerCase()
              .includes(
                keyword
              ) ||
            item.level
              .toLowerCase()
              .includes(
                keyword
              ) ||
            namaDivisi
              .toLowerCase()
              .includes(
                keyword
              )
          )
        }
      )
    }, [
      positions,
      search,
      divisions,
    ])

  const getJumlahKaryawan =
    (
      namaDivisi: string
    ) => {
      return employees.filter(
        (item) =>
          item.divisi ===
          namaDivisi
      ).length
    }

  const getJumlahJabatan =
    (
      divisionId: string
    ) => {
      return positions.filter(
        (item) =>
          item.divisionId ===
          divisionId
      ).length
    }

  const handleSubmitDivision =
    (
      data: Omit<
        Division,
        'id'
      >
    ) => {
      if (
        selectedDivision
      ) {
        editDivisi(
          selectedDivision.id,
          data
        )

        toast.success(
          'Divisi berhasil diperbarui.'
        )
      } else {
        tambahDivisi(data)

        toast.success(
          'Divisi berhasil ditambahkan.'
        )
      }

      setDivisionModal(
        false
      )

      setSelectedDivision(
        null
      )
    }

  const handleSubmitPosition =
    (
      data: Omit<
        Position,
        'id'
      >
    ) => {
      if (
        selectedPosition
      ) {
        editJabatan(
          selectedPosition.id,
          data
        )

        toast.success(
          'Jabatan berhasil diperbarui.'
        )
      } else {
        tambahJabatan(data)

        toast.success(
          'Jabatan berhasil ditambahkan.'
        )
      }

      setPositionModal(
        false
      )

      setSelectedPosition(
        null
      )
    }

  const handleConfirmDivision =
    () => {
      if (
        !confirmDivision
      ) {
        return
      }

      ubahStatusDivisi(
        confirmDivision.id
      )

      toast.success(
        confirmDivision.status ===
        'Aktif'
          ? 'Divisi dinonaktifkan.'
          : 'Divisi diaktifkan.'
      )

      setConfirmDivision(
        null
      )
    }

  const handleConfirmPosition =
    () => {
      if (
        !confirmPosition
      ) {
        return
      }

      ubahStatusJabatan(
        confirmPosition.id
      )

      toast.success(
        confirmPosition.status ===
        'Aktif'
          ? 'Jabatan dinonaktifkan.'
          : 'Jabatan diaktifkan.'
      )

      setConfirmPosition(
        null
      )
    }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Divisi & Jabatan
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola struktur organisasi, divisi, dan jabatan perusahaan.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => {
              if (
                tab ===
                'divisi'
              ) {
                setSelectedDivision(
                  null
                )

                setDivisionModal(
                  true
                )
              } else {
                setSelectedPosition(
                  null
                )

                setPositionModal(
                  true
                )
              }
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={18} />

            {tab ===
            'divisi'
              ? 'Tambah Divisi'
              : 'Tambah Jabatan'}
          </button>
        )}
      </div>

      {/* STATISTIK */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Divisi"
          value={
            divisions.length
          }
          icon={Building2}
        />

        <StatCard
          label="Total Jabatan"
          value={
            positions.length
          }
          icon={
            BriefcaseBusiness
          }
        />

        <StatCard
          label="Total Karyawan"
          value={
            employees.length
          }
          icon={Users}
        />
      </div>

      {/* CONTENT */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TAB */}
        <div className="flex border-b border-slate-200 px-5 pt-4">
          <button
            type="button"
            onClick={() => {
              setTab(
                'divisi'
              )

              setSearch('')
            }}
            className={`border-b-2 px-4 py-3 text-sm font-semibold ${
              tab ===
              'divisi'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500'
            }`}
          >
            Divisi
          </button>

          <button
            type="button"
            onClick={() => {
              setTab(
                'jabatan'
              )

              setSearch('')
            }}
            className={`border-b-2 px-4 py-3 text-sm font-semibold ${
              tab ===
              'jabatan'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500'
            }`}
          >
            Jabatan
          </button>
        </div>

        {/* SEARCH */}
        <div className="border-b border-slate-200 p-5">
          <div className="relative">
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
              placeholder={
                tab ===
                'divisi'
                  ? 'Cari nama atau kode divisi...'
                  : 'Cari jabatan, level, atau divisi...'
              }
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none focus:border-slate-900"
            />
          </div>
        </div>

        {/* DIVISI */}
        {tab ===
          'divisi' && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                  <th className="px-5 py-4">
                    Divisi
                  </th>

                  <th className="px-5 py-4">
                    Jabatan
                  </th>

                  <th className="px-5 py-4">
                    Karyawan
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
                {filteredDivisions.map(
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
                            item.kode
                          }{' '}
                          •{' '}
                          {
                            item.deskripsi
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {getJumlahJabatan(
                          item.id
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {getJumlahKaryawan(
                          item.nama
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            item.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        {canManage && (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDivision(
                                  item
                                )

                                setDivisionModal(
                                  true
                                )
                              }}
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Pencil
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDivision(
                                  item
                                )
                              }
                              className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                                item.status ===
                                'Aktif'
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {item.status ===
                              'Aktif'
                                ? 'Nonaktifkan'
                                : 'Aktifkan'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* JABATAN */}
        {tab ===
          'jabatan' && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                  <th className="px-5 py-4">
                    Jabatan
                  </th>

                  <th className="px-5 py-4">
                    Divisi
                  </th>

                  <th className="px-5 py-4">
                    Level
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
                {filteredPositions.map(
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
                            item.id
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {getDivisionName(
                          item.divisionId
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {
                          item.level
                        }
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            item.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        {canManage && (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPosition(
                                  item
                                )

                                setPositionModal(
                                  true
                                )
                              }}
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Pencil
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setConfirmPosition(
                                  item
                                )
                              }
                              className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                                item.status ===
                                'Aktif'
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {item.status ===
                              'Aktif'
                                ? 'Nonaktifkan'
                                : 'Aktifkan'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DivisionFormModal
        terbuka={
          divisionModal
        }
        division={
          selectedDivision
        }
        onClose={() => {
          setDivisionModal(
            false
          )

          setSelectedDivision(
            null
          )
        }}
        onSubmit={
          handleSubmitDivision
        }
      />

      <PositionFormModal
        terbuka={
          positionModal
        }
        position={
          selectedPosition
        }
        divisions={
          divisions
        }
        onClose={() => {
          setPositionModal(
            false
          )

          setSelectedPosition(
            null
          )
        }}
        onSubmit={
          handleSubmitPosition
        }
      />

      <ConfirmModal
        terbuka={Boolean(
          confirmDivision
        )}
        judul={
          confirmDivision
            ?.status ===
          'Aktif'
            ? 'Nonaktifkan Divisi'
            : 'Aktifkan Divisi'
        }
        pesan={
          confirmDivision
            ? `Apakah Anda yakin ingin ${
                confirmDivision.status ===
                'Aktif'
                  ? 'menonaktifkan'
                  : 'mengaktifkan'
              } divisi ${confirmDivision.nama}?`
            : ''
        }
        labelKonfirmasi={
          confirmDivision
            ?.status ===
          'Aktif'
            ? 'Nonaktifkan'
            : 'Aktifkan'
        }
        tipe={
          confirmDivision
            ?.status ===
          'Aktif'
            ? 'bahaya'
            : 'normal'
        }
        onClose={() =>
          setConfirmDivision(
            null
          )
        }
        onConfirm={
          handleConfirmDivision
        }
      />

      <ConfirmModal
        terbuka={Boolean(
          confirmPosition
        )}
        judul={
          confirmPosition
            ?.status ===
          'Aktif'
            ? 'Nonaktifkan Jabatan'
            : 'Aktifkan Jabatan'
        }
        pesan={
          confirmPosition
            ? `Apakah Anda yakin ingin ${
                confirmPosition.status ===
                'Aktif'
                  ? 'menonaktifkan'
                  : 'mengaktifkan'
              } jabatan ${confirmPosition.nama}?`
            : ''
        }
        labelKonfirmasi={
          confirmPosition
            ?.status ===
          'Aktif'
            ? 'Nonaktifkan'
            : 'Aktifkan'
        }
        tipe={
          confirmPosition
            ?.status ===
          'Aktif'
            ? 'bahaya'
            : 'normal'
        }
        onClose={() =>
          setConfirmPosition(
            null
          )
        }
        onConfirm={
          handleConfirmPosition
        }
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: typeof Building2
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
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
  return status ===
    'Aktif' ? (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      Aktif
    </span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      Nonaktif
    </span>
  )
}