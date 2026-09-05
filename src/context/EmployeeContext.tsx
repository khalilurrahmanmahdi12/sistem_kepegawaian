import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

import { initialEmployees } from '../data/employees'

import type {
  Employee,
  EmployeeStatus,
} from '../types/employee'

interface EmployeeContextType {
  employees: Employee[]
  tambahKaryawan: (
    employee: Omit<Employee, 'id'>
  ) => void
  editKaryawan: (
    id: string,
    employee: Omit<Employee, 'id'>
  ) => void
  ubahStatusKaryawan: (
    id: string,
    status: EmployeeStatus
  ) => void
}

const EmployeeContext =
  createContext<EmployeeContextType | undefined>(undefined)

interface EmployeeProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'kepegawaian_employees'

export function EmployeeProvider({
  children,
}: EmployeeProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)

    if (savedData) {
      try {
        return JSON.parse(savedData)
      } catch {
        return initialEmployees
      }
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialEmployees)
    )

    return initialEmployees
  })

  const simpan = (data: Employee[]) => {
    setEmployees(data)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    )
  }

  const tambahKaryawan = (
    employee: Omit<Employee, 'id'>
  ) => {
    const numbers = employees.map((item) => {
      const number = Number(
        item.id.replace('EMP-', '')
      )

      return Number.isNaN(number) ? 0 : number
    })

    const nextNumber = Math.max(0, ...numbers) + 1

    const id = `EMP-${String(nextNumber).padStart(3, '0')}`

    simpan([
      ...employees,
      {
        id,
        ...employee,
      },
    ])
  }

  const editKaryawan = (
    id: string,
    employee: Omit<Employee, 'id'>
  ) => {
    simpan(
      employees.map((item) =>
        item.id === id
          ? {
              id,
              ...employee,
            }
          : item
      )
    )
  }

  const ubahStatusKaryawan = (
    id: string,
    status: EmployeeStatus
  ) => {
    simpan(
      employees.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    )
  }

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        tambahKaryawan,
        editKaryawan,
        ubahStatusKaryawan,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees() {
  const context = useContext(EmployeeContext)

  if (!context) {
    throw new Error(
      'useEmployees harus digunakan di dalam EmployeeProvider'
    )
  }

  return context
}