export type LeaveStatus =
  | 'Menunggu'
  | 'Disetujui'
  | 'Ditolak'

export type LeaveType =
  | 'Cuti Tahunan'
  | 'Cuti Sakit'
  | 'Cuti Melahirkan'
  | 'Cuti Menikah'
  | 'Cuti Khusus'

export interface LeaveRequest {
  id: string
  employeeId: string
  nama: string
  nip: string
  divisi: string

  jenisCuti: LeaveType
  tanggalMulai: string
  tanggalSelesai: string
  jumlahHari: number
  alasan: string

  status: LeaveStatus
  tanggalPengajuan: string

  catatanPersetujuan?: string
  diprosesOleh?: string
}