export type UserRole = 'Administrator' | 'HR' | 'Manager' | 'Karyawan'

export interface User {
  id: number
  nama: string
  email: string
  whatsapp: string
  role: UserRole
  divisi: string
  jabatan: string
}

export const users: User[] = [
  {
    id: 1,
    nama: 'Administrator Sistem',
    email: 'admin@perusahaan.com',
    whatsapp: '081234567890',
    role: 'Administrator',
    divisi: 'Teknologi Informasi',
    jabatan: 'System Administrator',
  },
  {
    id: 2,
    nama: 'Nadia Putri',
    email: 'hr@perusahaan.com',
    whatsapp: '081234567891',
    role: 'HR',
    divisi: 'Human Resources',
    jabatan: 'HR Officer',
  },
  {
    id: 3,
    nama: 'Rizky Pratama',
    email: 'manager@perusahaan.com',
    whatsapp: '081234567892',
    role: 'Manager',
    divisi: 'Operasional',
    jabatan: 'Manager Operasional',
  },
  {
    id: 4,
    nama: 'Andi Saputra',
    email: 'karyawan@perusahaan.com',
    whatsapp: '081234567893',
    role: 'Karyawan',
    divisi: 'Operasional',
    jabatan: 'Staff Operasional',
  },
]