export type PermissionStatus =
  | 'Menunggu'
  | 'Disetujui'
  | 'Ditolak'

export type PermissionType =
  | 'Izin Pribadi'
  | 'Izin Keluarga'
  | 'Izin Keperluan Resmi'
  | 'Izin Terlambat'
  | 'Izin Pulang Cepat'
  | 'Lainnya'

export interface PermissionRequest {
  id: string

  employeeId: string
  nama: string
  nip: string
  divisi: string

  jenisIzin: PermissionType

  tanggal: string

  jamMulai: string
  jamSelesai: string

  durasiMenit: number

  alasan: string

  lampiran?: string

  status: PermissionStatus

  tanggalPengajuan: string

  catatanPersetujuan?: string

  diprosesOleh?: string
}