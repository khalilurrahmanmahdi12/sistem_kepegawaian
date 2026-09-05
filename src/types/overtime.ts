export type OvertimeStatus =
  | 'Menunggu'
  | 'Disetujui'
  | 'Ditolak'

export interface OvertimeRequest {
  id: string

  employeeId: string
  nama: string
  nip: string
  divisi: string

  tanggal: string

  jamMulai: string
  jamSelesai: string

  durasiMenit: number

  alasan: string

  status: OvertimeStatus

  tanggalPengajuan: string

  catatanPersetujuan?: string
  diprosesOleh?: string
}