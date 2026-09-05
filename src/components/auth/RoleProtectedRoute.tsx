import type {
  ReactNode,
} from 'react'

import {
  Navigate,
} from 'react-router'

import {
  useAuth,
} from '../../context/AuthContext'

import type {
  UserRole,
} from '../../data/users'

interface RoleProtectedRouteProps {
  children: ReactNode
  allowedRoles: UserRole[]
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const {
    user,
    isAuthenticated,
  } = useAuth()

  if (
    !isAuthenticated ||
    !user
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate
        to="/403"
        replace
      />
    )
  }

  return children
}