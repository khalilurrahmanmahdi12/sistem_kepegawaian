import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

import { initialAttendance } from '../data/attendance'

import type {
  Attendance,
} from '../types/attendance'

interface AttendanceContextType {
  attendance: Attendance[]

  checkIn: (data: {
    employeeId: string
    nama: string
    nip: string
    divisi: string
  }) => {
    berhasil: boolean
    pesan: string
  }

  checkOut: (
    employeeId: string
  ) => {
    berhasil: boolean
    pesan: string
  }
}

const AttendanceContext =
  createContext<
    AttendanceContextType | undefined
  >(undefined)

interface AttendanceProviderProps {
  children: ReactNode
}

const STORAGE_KEY =
  'kepegawaian_attendance'

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

function getJamSekarang() {
  const now = new Date()

  const jam = String(
    now.getHours()
  ).padStart(2, '0')

  const menit = String(
    now.getMinutes()
  ).padStart(2, '0')

  return `${jam}:${menit}`
}

export function AttendanceProvider({
  children,
}: AttendanceProviderProps) {
  const [
    attendance,
    setAttendance,
  ] = useState<Attendance[]>(() => {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      )

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialAttendance
      }
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        initialAttendance
      )
    )

    return initialAttendance
  })

  const simpan = (
    data: Attendance[]
  ) => {
    setAttendance(data)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    )
  }

  const checkIn = (data: {
    employeeId: string
    nama: string
    nip: string
    divisi: string
  }) => {
    const tanggal =
      getTanggalHariIni()

    const sudahAda =
      attendance.find(
        (item) =>
          item.employeeId ===
            data.employeeId &&
          item.tanggal ===
            tanggal
      )

    if (sudahAda) {
      return {
        berhasil: false,
        pesan:
          'Anda sudah melakukan absensi masuk hari ini.',
      }
    }

    const jamMasuk =
      getJamSekarang()

    const batasMasuk =
      '08:00'

    const status =
      jamMasuk > batasMasuk
        ? 'Terlambat'
        : 'Hadir'

    const numbers =
      attendance.map(
        (item) => {
          const number =
            Number(
              item.id.replace(
                'ABS-',
                ''
              )
            )

          return Number.isNaN(
            number
          )
            ? 0
            : number
        }
      )

    const nextNumber =
      Math.max(
        0,
        ...numbers
      ) + 1

    const id = `ABS-${String(
      nextNumber
    ).padStart(3, '0')}`

    const dataBaru: Attendance =
      {
        id,
        employeeId:
          data.employeeId,
        nama: data.nama,
        nip: data.nip,
        divisi: data.divisi,
        tanggal,
        jamMasuk,
        jamPulang: null,
        status,
      }

    simpan([
      ...attendance,
      dataBaru,
    ])

    return {
      berhasil: true,
      pesan:
        status ===
        'Terlambat'
          ? 'Absensi masuk berhasil. Anda tercatat terlambat.'
          : 'Absensi masuk berhasil.',
    }
  }

  const checkOut = (
    employeeId: string
  ) => {
    const tanggal =
      getTanggalHariIni()

    const dataHariIni =
      attendance.find(
        (item) =>
          item.employeeId ===
            employeeId &&
          item.tanggal ===
            tanggal
      )

    if (!dataHariIni) {
      return {
        berhasil: false,
        pesan:
          'Anda belum melakukan absensi masuk hari ini.',
      }
    }

    if (
      dataHariIni.jamPulang
    ) {
      return {
        berhasil: false,
        pesan:
          'Anda sudah melakukan absensi pulang hari ini.',
      }
    }

    const jamPulang =
      getJamSekarang()

    simpan(
      attendance.map(
        (item) =>
          item.id ===
          dataHariIni.id
            ? {
                ...item,
                jamPulang,
              }
            : item
      )
    )

    return {
      berhasil: true,
      pesan:
        'Absensi pulang berhasil.',
    }
  }

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        checkIn,
        checkOut,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  )
}

export function useAttendance() {
  const context =
    useContext(
      AttendanceContext
    )

  if (!context) {
    throw new Error(
      'useAttendance harus digunakan di dalam AttendanceProvider'
    )
  }

  return context
}