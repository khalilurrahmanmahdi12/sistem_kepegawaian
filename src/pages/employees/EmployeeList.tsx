import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { toast } from 'sonner'

import EmployeeDetailModal from '../../components/employees/EmployeeDetailModal'
import EmployeeFormModal from '../../components/employees/EmployeeFormModal'
import ConfirmModal from '../../components/ui/ConfirmModal'

import { useAuth } from '../../context/AuthContext'
import { useEmployees } from '../../context/EmployeeContext'

import type { Employee } from '../../types/employee'

const ITEMS_PER_PAGE = 6

export default function EmployeeList() {
  const { user } = useAuth()

  const {
    employees,
    tambahKaryawan,
    editKaryawan,
    ubahStatusKaryawan,
  } = useEmployees()

  const [search, setSearch] = useState('')
  const [filterDivisi, setFilterDivisi] =
    useState('Semua')
  const [filterStatus, setFilterStatus] =
    useState('Semua')
  const [currentPage, setCurrentPage] =
    useState(1)

  const [
    formTerbuka,
    setFormTerbuka,
  ] = useState(false)

  const [
    formMode,
    setFormMode,
  ] = useState<'tambah' | 'edit'>('tambah')

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<Employee | null>(null)

  const [
    detailEmployee,
    setDetailEmployee,
  ] = useState<Employee | null>(null)

  const [
    employeeStatusTarget,
    setEmployeeStatusTarget,
  ] = useState<Employee | null>(null)

  const canManage =
    user?.role === 'Administrator' ||
    user?.role === 'HR'

  const divisions = useMemo(() => {
    return Array.from(
      new Set(
        employees.map(
          (employee) => employee.divisi
        )
      )
    ).sort()
  }, [employees])

  const filteredEmployees = useMemo(() => {
    const keyword =
      search.toLowerCase().trim()

    return employees.filter((employee) => {
      const cocokPencarian =
        employee.nama
          .toLowerCase()
          .includes(keyword) ||
        employee.nip
          .toLowerCase()
          .includes(keyword) ||
        employee.email
          .toLowerCase()
          .includes(keyword) ||
        employee.jabatan
          .toLowerCase()
          .includes(keyword)

      const cocokDivisi =
        filterDivisi === 'Semua' ||
        employee.divisi === filterDivisi

      const cocokStatus =
        filterStatus === 'Semua' ||
        employee.status === filterStatus

      return (
        cocokPencarian &&
        cocokDivisi &&
        cocokStatus
      )
    })
  }, [
    employees,
    search,
    filterDivisi,
    filterStatus,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEmployees.length /
        ITEMS_PER_PAGE
    )
  )

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages)
    }
  }, [
    currentPage,
    totalPages,
  ])

  useEffect(() => {
    setCurrentPage(1)
  }, [
    search,
    filterDivisi,
    filterStatus,
  ])

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE

  const displayedEmployees =
    filteredEmployees.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    )

  const totalAktif =
    employees.filter(
      (employee) =>
        employee.status === 'Aktif'
    ).length

  const totalNonaktif =
    employees.filter(
      (employee) =>
        employee.status === 'Nonaktif'
    ).length

  const handleTambah = () => {
    setSelectedEmployee(null)
    setFormMode('tambah')
    setFormTerbuka(true)
  }

  const handleEdit = (
    employee: Employee
  ) => {
    setSelectedEmployee(employee)
    setFormMode('edit')
    setFormTerbuka(true)
  }

  const handleSubmit = (
    data: Omit<Employee, 'id'>
  ) => {
    if (
      formMode === 'tambah'
    ) {
      tambahKaryawan(data)

      toast.success(
        'Data karyawan berhasil ditambahkan.'
      )
    } else if (
      selectedEmployee
    ) {
      editKaryawan(
        selectedEmployee.id,
        data
      )

      toast.success(
        'Data karyawan berhasil diperbarui.'
      )
    }

    setFormTerbuka(false)
    setSelectedEmployee(null)
  }

  const handleStatus = (
    employee: Employee
  ) => {
    setEmployeeStatusTarget(employee)
  }

  const handleConfirmStatus = () => {
    if (!employeeStatusTarget) {
      return
    }

    const statusBaru =
      employeeStatusTarget.status === 'Aktif'
        ? 'Nonaktif'
        : 'Aktif'

    ubahStatusKaryawan(
      employeeStatusTarget.id,
      statusBaru
    )

    toast.success(
      `Status ${employeeStatusTarget.nama} berhasil diubah menjadi ${statusBaru}.`
    )

    setEmployeeStatusTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Data Karyawan
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola informasi dan status karyawan perusahaan.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={handleTambah}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Tambah Karyawan
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Karyawan
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {employees.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 text-white">
              <Users size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Karyawan Aktif
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalAktif}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-800">
              <UserCheck size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Karyawan Nonaktif
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalNonaktif}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-800">
              <UserX size={21} />
            </div>
          </div>
        </div>
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
              placeholder="Cari nama, NIP, email, atau jabatan..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <select
            value={filterDivisi}
            onChange={(event) =>
              setFilterDivisi(
                event.target.value
              )
            }
            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-900"
          >
            <option value="Semua">
              Semua Divisi
            </option>

            {divisions.map(
              (division) => (
                <option
                  key={division}
                  value={division}
                >
                  {division}
                </option>
              )
            )}
          </select>

          <select
            value={filterStatus}
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

            <option value="Aktif">
              Aktif
            </option>

            <option value="Nonaktif">
              Nonaktif
            </option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">
                  Karyawan
                </th>

                <th className="px-5 py-4">
                  Divisi
                </th>

                <th className="px-5 py-4">
                  Jabatan
                </th>

                <th className="px-5 py-4">
                  Status Kerja
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
              {displayedEmployees.length > 0 ? (
                displayedEmployees.map(
                  (employee) => (
                    <tr
                      key={employee.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {employee.nama}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {employee.nip} • {employee.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {employee.divisi}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {employee.jabatan}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {employee.statusKerja}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            employee.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            title="Lihat Detail"
                            onClick={() =>
                              setDetailEmployee(employee)
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                          >
                            <Eye size={18} />
                          </button>

                          {canManage && (
                            <>
                              <button
                                type="button"
                                title="Edit"
                                onClick={() =>
                                  handleEdit(employee)
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                              >
                                <Pencil size={17} />
                              </button>

                              <button
                                type="button"
                                title={
                                  employee.status === 'Aktif'
                                    ? 'Nonaktifkan'
                                    : 'Aktifkan'
                                }
                                onClick={() =>
                                  handleStatus(employee)
                                }
                                className={`rounded-lg p-2 transition ${
                                  employee.status === 'Aktif'
                                    ? 'text-red-500 hover:bg-red-50'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                {employee.status === 'Aktif' ? (
                                  <UserX size={18} />
                                ) : (
                                  <UserCheck size={18} />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >
                    <Users
                      size={36}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      Data karyawan tidak ditemukan.
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

        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">
            Menampilkan{' '}
            {filteredEmployees.length === 0
              ? 0
              : startIndex + 1}
            {' - '}
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              filteredEmployees.length
            )}{' '}
            dari {filteredEmployees.length} karyawan
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page - 1
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                  currentPage === page
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page + 1
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <EmployeeFormModal
        terbuka={formTerbuka}
        mode={formMode}
        employee={selectedEmployee}
        onClose={() => {
          setFormTerbuka(false)
          setSelectedEmployee(null)
        }}
        onSubmit={handleSubmit}
      />

      <EmployeeDetailModal
        employee={detailEmployee}
        onClose={() =>
          setDetailEmployee(null)
        }
      />

      <ConfirmModal
        terbuka={Boolean(employeeStatusTarget)}
        judul={
          employeeStatusTarget?.status === 'Aktif'
            ? 'Nonaktifkan Karyawan'
            : 'Aktifkan Karyawan'
        }
        pesan={
          employeeStatusTarget
            ? employeeStatusTarget.status === 'Aktif'
              ? `Apakah Anda yakin ingin menonaktifkan ${employeeStatusTarget.nama}? Karyawan yang dinonaktifkan tidak lagi dihitung sebagai karyawan aktif.`
              : `Apakah Anda yakin ingin mengaktifkan kembali ${employeeStatusTarget.nama}?`
            : ''
        }
        labelKonfirmasi={
          employeeStatusTarget?.status === 'Aktif'
            ? 'Nonaktifkan'
            : 'Aktifkan'
        }
        tipe={
          employeeStatusTarget?.status === 'Aktif'
            ? 'bahaya'
            : 'normal'
        }
        onConfirm={handleConfirmStatus}
        onClose={() =>
          setEmployeeStatusTarget(null)
        }
      />
    </div>
  )
}