import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

import { initialPermissions } from '../data/permissions'

import type {
  PermissionRequest,
  PermissionStatus,
} from '../types/permission'

interface PermissionContextType {
  permissions: PermissionRequest[]

  tambahIzin: (
    data: Omit<
      PermissionRequest,
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

  prosesIzin: (
    id: string,
    status: Exclude<PermissionStatus, 'Menunggu'>,
    catatan: string,
    diprosesOleh: string
  ) => {
    berhasil: boolean
    pesan: string
  }
}

const PermissionContext =
  createContext<PermissionContextType | undefined>(
    undefined
  )

interface PermissionProviderProps {
  children: ReactNode
}

const STORAGE_KEY =
  'kepegawaian_permission_requests'

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

export function PermissionProvider({
  children,
}: PermissionProviderProps) {
  const [
    permissions,
    setPermissions,
  ] = useState<PermissionRequest[]>(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY)

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialPermissions
      }
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialPermissions)
    )

    return initialPermissions
  })

  const simpan = (
    data: PermissionRequest[]
  ) => {
    setPermissions(data)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    )
  }

  const tambahIzin = (
    data: Omit<
      PermissionRequest,
      | 'id'
      | 'status'
      | 'tanggalPengajuan'
      | 'catatanPersetujuan'
      | 'diprosesOleh'
    >
  ) => {
    const masihMenunggu =
      permissions.some(
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
          'Masih ada pengajuan izin yang menunggu persetujuan.',
      }
    }

    const numbers =
      permissions.map((item) => {
        const number = Number(
          item.id.replace(
            'IZIN-',
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

    const id = `IZIN-${String(
      nextNumber
    ).padStart(3, '0')}`

    const dataBaru: PermissionRequest =
      {
        ...data,
        id,
        status: 'Menunggu',
        tanggalPengajuan:
          getTanggalHariIni(),
      }

    simpan([
      ...permissions,
      dataBaru,
    ])

    return {
      berhasil: true,
      pesan:
        'Pengajuan izin berhasil dikirim.',
    }
  }

  const prosesIzin = (
    id: string,
    status: Exclude<
      PermissionStatus,
      'Menunggu'
    >,
    catatan: string,
    diprosesOleh: string
  ) => {
    const request =
      permissions.find(
        (item) =>
          item.id === id
      )

    if (!request) {
      return {
        berhasil: false,
        pesan:
          'Pengajuan izin tidak ditemukan.',
      }
    }

    if (
      request.status !==
      'Menunggu'
    ) {
      return {
        berhasil: false,
        pesan:
          'Pengajuan izin ini sudah diproses.',
      }
    }

    simpan(
      permissions.map(
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
          ? 'Pengajuan izin berhasil disetujui.'
          : 'Pengajuan izin berhasil ditolak.',
    }
  }

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        tambahIzin,
        prosesIzin,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermission() {
  const context =
    useContext(
      PermissionContext
    )

  if (!context) {
    throw new Error(
      'usePermission harus digunakan di dalam PermissionProvider'
    )
  }

  return context
}