export type EmployeeStatus = 'Aktif' | 'Nonaktif'

export type EmploymentStatus =
  | 'Tetap'
  | 'Kontrak'
  | 'Magang'

export interface Employee {
  id: string
  nip: string
  nama: string
  email: string
  whatsapp: string
  jenisKelamin: 'Laki-laki' | 'Perempuan'
  tempatLahir: string
  tanggalLahir: string
  alamat: string
  divisi: string
  jabatan: string
  statusKerja: EmploymentStatus
  status: EmployeeStatus
  tanggalMasuk: string
}