import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

import { initialOvertimeRequests } from '../data/overtime'

import type {
  OvertimeRequest,
  OvertimeStatus,
} from '../types/overtime'

interface OvertimeContextType {
  overtimeRequests: OvertimeRequest[]

  tambahLembur: (
    data: Omit<
      OvertimeRequest,
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

  prosesLembur: (
    id: string,
    status: Exclude<OvertimeStatus, 'Menunggu'>,
    catatan: string,
    diprosesOleh: string
  ) => {
    berhasil: boolean
    pesan: string
  }

  getTotalLemburMenit: (
    employeeId: string
  ) => number
}

const OvertimeContext =
  createContext<OvertimeContextType | undefined>(
    undefined
  )

interface OvertimeProviderProps {
  children: ReactNode
}

const STORAGE_KEY =
  'kepegawaian_overtime_requests'

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

export function OvertimeProvider({
  children,
}: OvertimeProviderProps) {
  const [
    overtimeRequests,
    setOvertimeRequests,
  ] = useState<OvertimeRequest[]>(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY)

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialOvertimeRequests
      }
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        initialOvertimeRequests
      )
    )

    return initialOvertimeRequests
  })

  const simpan = (
    data: OvertimeRequest[]
  ) => {
    setOvertimeRequests(data)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    )
  }

  const tambahLembur = (
    data: Omit<
      OvertimeRequest,
      | 'id'
      | 'status'
      | 'tanggalPengajuan'
      | 'catatanPersetujuan'
      | 'diprosesOleh'
    >
  ) => {
    const masihMenunggu =
      overtimeRequests.some(
        (item) =>
          item.employeeId ===
            data.employeeId &&
          item.status ===
            'Menunggu'
      )

    if (masihMenunggu) {
      return {
        berhasil: false,
        pesan:
          'Masih ada pengajuan lembur yang menunggu persetujuan.',
      }
    }

    const numbers =
      overtimeRequests.map((item) => {
        const number = Number(
          item.id.replace(
            'LBR-',
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

    const id = `LBR-${String(
      nextNumber
    ).padStart(3, '0')}`

    const dataBaru: OvertimeRequest = {
      ...data,
      id,
      status: 'Menunggu',
      tanggalPengajuan:
        getTanggalHariIni(),
    }

    simpan([
      ...overtimeRequests,
      dataBaru,
    ])

    return {
      berhasil: true,
      pesan:
        'Pengajuan lembur berhasil dikirim.',
    }
  }

  const prosesLembur = (
    id: string,
    status: Exclude<
      OvertimeStatus,
      'Menunggu'
    >,
    catatan: string,
    diprosesOleh: string
  ) => {
    const request =
      overtimeRequests.find(
        (item) =>
          item.id === id
      )

    if (!request) {
      return {
        berhasil: false,
        pesan:
          'Pengajuan lembur tidak ditemukan.',
      }
    }

    if (
      request.status !==
      'Menunggu'
    ) {
      return {
        berhasil: false,
        pesan:
          'Pengajuan lembur ini sudah diproses.',
      }
    }

    simpan(
      overtimeRequests.map(
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
          ? 'Pengajuan lembur berhasil disetujui.'
          : 'Pengajuan lembur berhasil ditolak.',
    }
  }

  const getTotalLemburMenit = (
    employeeId: string
  ) => {
    return overtimeRequests
      .filter(
        (item) =>
          item.employeeId ===
            employeeId &&
          item.status ===
            'Disetujui'
      )
      .reduce(
        (total, item) =>
          total +
          item.durasiMenit,
        0
      )
  }

  return (
    <OvertimeContext.Provider
      value={{
        overtimeRequests,
        tambahLembur,
        prosesLembur,
        getTotalLemburMenit,
      }}
    >
      {children}
    </OvertimeContext.Provider>
  )
}

export function useOvertime() {
  const context =
    useContext(
      OvertimeContext
    )

  if (!context) {
    throw new Error(
      'useOvertime harus digunakan di dalam OvertimeProvider'
    )
  }

  return context
}