export type AttendanceStatus =
  | 'Hadir'
  | 'Terlambat'
  | 'Izin'
  | 'Tidak Hadir'

export interface Attendance {
  id: string
  employeeId: string
  nama: string
  nip: string
  divisi: string

  tanggal: string

  jamMasuk: string | null
  jamPulang: string | null

  status: AttendanceStatus
  keterangan?: string
}