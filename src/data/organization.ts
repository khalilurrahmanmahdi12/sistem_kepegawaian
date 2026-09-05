import type {
  Division,
  Position,
} from '../types/organization'

export const initialDivisions: Division[] = [
  {
    id: 'DIV-001',
    nama: 'Human Resources',
    kode: 'HR',
    deskripsi:
      'Mengelola sumber daya manusia dan administrasi kepegawaian.',
    status: 'Aktif',
  },
  {
    id: 'DIV-002',
    nama: 'Teknologi Informasi',
    kode: 'TI',
    deskripsi:
      'Mengelola sistem informasi, perangkat, aplikasi, dan infrastruktur teknologi.',
    status: 'Aktif',
  },
  {
    id: 'DIV-003',
    nama: 'Operasional',
    kode: 'OPS',
    deskripsi:
      'Mengelola kegiatan operasional perusahaan.',
    status: 'Aktif',
  },
  {
    id: 'DIV-004',
    nama: 'Keuangan',
    kode: 'KEU',
    deskripsi:
      'Mengelola keuangan, pembayaran, anggaran, dan pelaporan keuangan.',
    status: 'Aktif',
  },
  {
    id: 'DIV-005',
    nama: 'Administrasi',
    kode: 'ADM',
    deskripsi:
      'Mengelola administrasi dan dokumentasi perusahaan.',
    status: 'Aktif',
  },
  {
    id: 'DIV-006',
    nama: 'Pemasaran',
    kode: 'MKT',
    deskripsi:
      'Mengelola pemasaran, promosi, dan komunikasi perusahaan.',
    status: 'Aktif',
  },
]

export const initialPositions: Position[] = [
  {
    id: 'JBT-001',
    divisionId: 'DIV-001',
    nama: 'HR Officer',
    level: 'Staff',
    status: 'Aktif',
  },
  {
    id: 'JBT-002',
    divisionId: 'DIV-001',
    nama: 'HR Administrator',
    level: 'Staff',
    status: 'Aktif',
  },
  {
    id: 'JBT-003',
    divisionId: 'DIV-002',
    nama: 'IT Support',
    level: 'Staff',
    status: 'Aktif',
  },
  {
    id: 'JBT-004',
    divisionId: 'DIV-002',
    nama: 'Software Developer',
    level: 'Staff',
    status: 'Aktif',
  },
  {
    id: 'JBT-005',
    divisionId: 'DIV-002',
    nama: 'UI/UX Designer',
    level: 'Staff',
    status: 'Aktif',
  },
  {
    id: 'JBT-006',
    divisionId: 'DIV-003',
    nama: 'Manager Operasional',
    level: 'Manager',
    status: 'Aktif',
  },
  {
    id: 'JBT-007',
    divisionId: 'DIV-003',
    nama: 'Staff Operasional',
    level: 'Staff',
    status: 'Aktif',
  },
  {
    id: 'JBT-008',
    divisionId: 'DIV-004',
    nama: 'Staff Keuangan',
    level: 'Staff',
    status: 'Aktif',
  },
  {
    id: 'JBT-009',
    divisionId: 'DIV-004',
    nama: 'Supervisor Keuangan',
    level: 'Supervisor',
    status: 'Aktif',
  },
  {
    id: 'JBT-010',
    divisionId: 'DIV-005',
    nama: 'Staff Administrasi',
    level: 'Staff',
    status: 'Aktif',
  },
  {
    id: 'JBT-011',
    divisionId: 'DIV-006',
    nama: 'Marketing Officer',
    level: 'Staff',
    status: 'Aktif',
  },
]