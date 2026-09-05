export type OrganizationStatus =
  | 'Aktif'
  | 'Nonaktif'

export interface Division {
  id: string
  nama: string
  kode: string
  deskripsi: string
  status: OrganizationStatus
}

export interface Position {
  id: string
  divisionId: string
  nama: string
  level: string
  status: OrganizationStatus
}