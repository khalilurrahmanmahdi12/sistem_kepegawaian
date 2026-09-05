import {
  Navigate,
  Route,
  Routes,
} from 'react-router'

import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'

import EmployeeList from './pages/employees/EmployeeList'
import Attendance from './pages/attendance/Attendance'
import Leave from './pages/leave/Leave'
import Permission from './pages/permissions/Permission'
import Overtime from './pages/overtime/Overtime'
import Approval from './pages/approvals/Approval'
import Organization from './pages/organization/Organization'
import Report from './pages/reports/Report'

import Profile from './pages/profile/Profile'
import Settings from './pages/settings/Settings'
import Forbidden from './pages/errors/Forbidden'

import DashboardLayout from './layouts/DashboardLayout'

import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleProtectedRoute from './components/auth/RoleProtectedRoute'

function App() {
  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* DATA KARYAWAN */}
      <Route
        path="/karyawan"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute
              allowedRoles={[
                'Administrator',
                'HR',
                'Manager',
              ]}
            >
              <DashboardLayout>
                <EmployeeList />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* ABSENSI */}
      <Route
        path="/absensi"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Attendance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* CUTI */}
      <Route
        path="/cuti"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Leave />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* IZIN */}
      <Route
        path="/izin"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Permission />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* LEMBUR */}
      <Route
        path="/lembur"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Overtime />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* PERSETUJUAN */}
      <Route
        path="/persetujuan"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute
              allowedRoles={[
                'Administrator',
                'HR',
                'Manager',
              ]}
            >
              <DashboardLayout>
                <Approval />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* DIVISI & JABATAN */}
      <Route
        path="/divisi"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute
              allowedRoles={[
                'Administrator',
                'HR',
                'Manager',
              ]}
            >
              <DashboardLayout>
                <Organization />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* LAPORAN */}
      <Route
        path="/laporan"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute
              allowedRoles={[
                'Administrator',
                'HR',
                'Manager',
              ]}
            >
              <DashboardLayout>
                <Report />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profil"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* SETTINGS */}
      <Route
        path="/pengaturan"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 403 */}
      <Route
        path="/403"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Forbidden />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App