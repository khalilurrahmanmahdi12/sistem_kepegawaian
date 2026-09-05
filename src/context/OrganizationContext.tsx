import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

import {
  initialDivisions,
  initialPositions,
} from '../data/organization'

import type {
  Division,
  Position,
} from '../types/organization'

interface OrganizationContextType {
  divisions: Division[]
  positions: Position[]

  tambahDivisi: (
    data: Omit<Division, 'id'>
  ) => void

  editDivisi: (
    id: string,
    data: Omit<Division, 'id'>
  ) => void

  ubahStatusDivisi: (
    id: string
  ) => void

  tambahJabatan: (
    data: Omit<Position, 'id'>
  ) => void

  editJabatan: (
    id: string,
    data: Omit<Position, 'id'>
  ) => void

  ubahStatusJabatan: (
    id: string
  ) => void

  getDivisionName: (
    divisionId: string
  ) => string
}

const OrganizationContext =
  createContext<
    OrganizationContextType | undefined
  >(undefined)

const DIVISION_STORAGE_KEY =
  'kepegawaian_divisions'

const POSITION_STORAGE_KEY =
  'kepegawaian_positions'

export function OrganizationProvider({
  children,
}: {
  children: ReactNode
}) {
  const [
    divisions,
    setDivisions,
  ] = useState<Division[]>(() => {
    const saved =
      localStorage.getItem(
        DIVISION_STORAGE_KEY
      )

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialDivisions
      }
    }

    localStorage.setItem(
      DIVISION_STORAGE_KEY,
      JSON.stringify(
        initialDivisions
      )
    )

    return initialDivisions
  })

  const [
    positions,
    setPositions,
  ] = useState<Position[]>(() => {
    const saved =
      localStorage.getItem(
        POSITION_STORAGE_KEY
      )

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialPositions
      }
    }

    localStorage.setItem(
      POSITION_STORAGE_KEY,
      JSON.stringify(
        initialPositions
      )
    )

    return initialPositions
  })

  const simpanDivisi = (
    data: Division[]
  ) => {
    setDivisions(data)

    localStorage.setItem(
      DIVISION_STORAGE_KEY,
      JSON.stringify(data)
    )
  }

  const simpanJabatan = (
    data: Position[]
  ) => {
    setPositions(data)

    localStorage.setItem(
      POSITION_STORAGE_KEY,
      JSON.stringify(data)
    )
  }

  const tambahDivisi = (
    data: Omit<
      Division,
      'id'
    >
  ) => {
    const numbers =
      divisions.map(
        (item) => {
          const number =
            Number(
              item.id.replace(
                'DIV-',
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

    const next =
      Math.max(
        0,
        ...numbers
      ) + 1

    const newDivision: Division =
      {
        id: `DIV-${String(
          next
        ).padStart(3, '0')}`,
        ...data,
      }

    simpanDivisi([
      ...divisions,
      newDivision,
    ])
  }

  const editDivisi = (
    id: string,
    data: Omit<
      Division,
      'id'
    >
  ) => {
    simpanDivisi(
      divisions.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                ...data,
              }
            : item
      )
    )
  }

  const ubahStatusDivisi = (
    id: string
  ) => {
    simpanDivisi(
      divisions.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                status:
                  item.status ===
                  'Aktif'
                    ? 'Nonaktif'
                    : 'Aktif',
              }
            : item
      )
    )
  }

  const tambahJabatan = (
    data: Omit<
      Position,
      'id'
    >
  ) => {
    const numbers =
      positions.map(
        (item) => {
          const number =
            Number(
              item.id.replace(
                'JBT-',
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

    const next =
      Math.max(
        0,
        ...numbers
      ) + 1

    const newPosition: Position =
      {
        id: `JBT-${String(
          next
        ).padStart(3, '0')}`,
        ...data,
      }

    simpanJabatan([
      ...positions,
      newPosition,
    ])
  }

  const editJabatan = (
    id: string,
    data: Omit<
      Position,
      'id'
    >
  ) => {
    simpanJabatan(
      positions.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                ...data,
              }
            : item
      )
    )
  }

  const ubahStatusJabatan = (
    id: string
  ) => {
    simpanJabatan(
      positions.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                status:
                  item.status ===
                  'Aktif'
                    ? 'Nonaktif'
                    : 'Aktif',
              }
            : item
      )
    )
  }

  const getDivisionName = (
    divisionId: string
  ) => {
    return (
      divisions.find(
        (item) =>
          item.id ===
          divisionId
      )?.nama ?? '-'
    )
  }

  return (
    <OrganizationContext.Provider
      value={{
        divisions,
        positions,
        tambahDivisi,
        editDivisi,
        ubahStatusDivisi,
        tambahJabatan,
        editJabatan,
        ubahStatusJabatan,
        getDivisionName,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context =
    useContext(
      OrganizationContext
    )

  if (!context) {
    throw new Error(
      'useOrganization harus digunakan di dalam OrganizationProvider'
    )
  }

  return context
}