import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

import { initialLeaveRequests } from '../data/leave'

import type {
  LeaveRequest,
  LeaveStatus,
} from '../types/leave'

interface LeaveBalance {
  employeeId: string
  saldo: number
}

interface LeaveContextType {
  leaveRequests: LeaveRequest[]
  leaveBalances: LeaveBalance[]

  tambahPengajuanCuti: (
    data: Omit<
      LeaveRequest,
      | 'id'
      | 'status'
      | 'tanggalPengajuan'
      | 'catatanPersetujuan'
      | 'diprosesOleh'
    >
  ) => {
    berhasil: boolean
    pesan: string
  }

  prosesPengajuanCuti: (
    id: string,
    status: Exclude<LeaveStatus, 'Menunggu'>,
    catatan: string,
    diprosesOleh: string
  ) => {
    berhasil: boolean
    pesan: string
  }

  getSaldoCuti: (
    employeeId: string
  ) => number
}

const LeaveContext =
  createContext<
    LeaveContextType | undefined
  >(undefined)

interface LeaveProviderProps {
  children: ReactNode
}

const LEAVE_STORAGE_KEY =
  'kepegawaian_leave_requests'

const BALANCE_STORAGE_KEY =
  'kepegawaian_leave_balances'

const DEFAULT_BALANCE = 12

const initialBalances: LeaveBalance[] = [
  {
    employeeId: 'EMP-001',
    saldo: 8,
  },
  {
    employeeId: 'EMP-002',
    saldo: 10,
  },
  {
    employeeId: 'EMP-003',
    saldo: 12,
  },
  {
    employeeId: 'EMP-004',
    saldo: 12,
  },
  {
    employeeId: 'EMP-005',
    saldo: 10,
  },
  {
    employeeId: 'EMP-006',
    saldo: 12,
  },
]

function getTanggalHariIni() {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(
    now.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    now.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function LeaveProvider({
  children,
}: LeaveProviderProps) {
  const [
    leaveRequests,
    setLeaveRequests,
  ] = useState<LeaveRequest[]>(() => {
    const saved =
      localStorage.getItem(
        LEAVE_STORAGE_KEY
      )

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialLeaveRequests
      }
    }

    localStorage.setItem(
      LEAVE_STORAGE_KEY,
      JSON.stringify(
        initialLeaveRequests
      )
    )

    return initialLeaveRequests
  })

  const [
    leaveBalances,
    setLeaveBalances,
  ] = useState<LeaveBalance[]>(() => {
    const saved =
      localStorage.getItem(
        BALANCE_STORAGE_KEY
      )

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialBalances
      }
    }

    localStorage.setItem(
      BALANCE_STORAGE_KEY,
      JSON.stringify(
        initialBalances
      )
    )

    return initialBalances
  })

  const simpanPengajuan = (
    data: LeaveRequest[]
  ) => {
    setLeaveRequests(data)

    localStorage.setItem(
      LEAVE_STORAGE_KEY,
      JSON.stringify(data)
    )
  }

  const simpanSaldo = (
    data: LeaveBalance[]
  ) => {
    setLeaveBalances(data)

    localStorage.setItem(
      BALANCE_STORAGE_KEY,
      JSON.stringify(data)
    )
  }

  const getSaldoCuti = (
    employeeId: string
  ) => {
    return (
      leaveBalances.find(
        (item) =>
          item.employeeId === employeeId
      )?.saldo ?? DEFAULT_BALANCE
    )
  }

  const tambahPengajuanCuti = (
    data: Omit<
      LeaveRequest,
      | 'id'
      | 'status'
      | 'tanggalPengajuan'
      | 'catatanPersetujuan'
      | 'diprosesOleh'
    >
  ) => {
    const saldo =
      getSaldoCuti(data.employeeId)

    if (
      data.jenisCuti ===
        'Cuti Tahunan' &&
      data.jumlahHari > saldo
    ) {
      return {
        berhasil: false,
        pesan:
          'Saldo cuti tahunan tidak mencukupi.',
      }
    }

    const sedangMenunggu =
      leaveRequests.some(
        (item) =>
          item.employeeId ===
            data.employeeId &&
          item.status ===
            'Menunggu'
      )

    if (sedangMenunggu) {
      return {
        berhasil: false,
        pesan:
          'Masih ada pengajuan cuti yang menunggu persetujuan.',
      }
    }

    const numbers =
      leaveRequests.map((item) => {
        const number = Number(
          item.id.replace(
            'CUTI-',
            ''
          )
        )

        return Number.isNaN(number)
          ? 0
          : number
      })

    const nextNumber =
      Math.max(
        0,
        ...numbers
      ) + 1

    const id = `CUTI-${String(
      nextNumber
    ).padStart(3, '0')}`

    const dataBaru: LeaveRequest =
      {
        ...data,
        id,
        status: 'Menunggu',
        tanggalPengajuan:
          getTanggalHariIni(),
      }

    simpanPengajuan([
      ...leaveRequests,
      dataBaru,
    ])

    return {
      berhasil: true,
      pesan:
        'Pengajuan cuti berhasil dikirim.',
    }
  }

  const prosesPengajuanCuti = (
    id: string,
    status: Exclude<
      LeaveStatus,
      'Menunggu'
    >,
    catatan: string,
    diprosesOleh: string
  ) => {
    const request =
      leaveRequests.find(
        (item) =>
          item.id === id
      )

    if (!request) {
      return {
        berhasil: false,
        pesan:
          'Pengajuan cuti tidak ditemukan.',
      }
    }

    if (
      request.status !==
      'Menunggu'
    ) {
      return {
        berhasil: false,
        pesan:
          'Pengajuan ini sudah diproses.',
      }
    }

    if (
      status ===
        'Disetujui' &&
      request.jenisCuti ===
        'Cuti Tahunan'
    ) {
      const saldoSaatIni =
        getSaldoCuti(
          request.employeeId
        )

      if (
        request.jumlahHari >
        saldoSaatIni
      ) {
        return {
          berhasil: false,
          pesan:
            'Saldo cuti karyawan tidak mencukupi.',
        }
      }

      const existing =
        leaveBalances.some(
          (item) =>
            item.employeeId ===
            request.employeeId
        )

      if (existing) {
        simpanSaldo(
          leaveBalances.map(
            (item) =>
              item.employeeId ===
              request.employeeId
                ? {
                    ...item,
                    saldo:
                      item.saldo -
                      request.jumlahHari,
                  }
                : item
          )
        )
      } else {
        simpanSaldo([
          ...leaveBalances,
          {
            employeeId:
              request.employeeId,
            saldo:
              DEFAULT_BALANCE -
              request.jumlahHari,
          },
        ])
      }
    }

    simpanPengajuan(
      leaveRequests.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                status,
                catatanPersetujuan:
                  catatan,
                diprosesOleh,
              }
            : item
      )
    )

    return {
      berhasil: true,
      pesan:
        status ===
        'Disetujui'
          ? 'Pengajuan cuti berhasil disetujui.'
          : 'Pengajuan cuti berhasil ditolak.',
    }
  }

  return (
    <LeaveContext.Provider
      value={{
        leaveRequests,
        leaveBalances,
        tambahPengajuanCuti,
        prosesPengajuanCuti,
        getSaldoCuti,
      }}
    >
      {children}
    </LeaveContext.Provider>
  )
}

export function useLeave() {
  const context =
    useContext(LeaveContext)

  if (!context) {
    throw new Error(
      'useLeave harus digunakan di dalam LeaveProvider'
    )
  }

  return context
}