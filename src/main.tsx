import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'

import './index.css'

import App from './App'

import { AuthProvider } from './context/AuthContext'
import { EmployeeProvider } from './context/EmployeeContext'
import { AttendanceProvider } from './context/AttendanceContext'
import { LeaveProvider } from './context/LeaveContext'
import { PermissionProvider } from './context/PermissionContext'
import { OvertimeProvider } from './context/OvertimeContext'
import { OrganizationProvider } from './context/OrganizationContext'

createRoot(
  document.getElementById(
    'root'
  )!
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EmployeeProvider>
          <AttendanceProvider>
            <LeaveProvider>
              <PermissionProvider>
                <OvertimeProvider>
                  <OrganizationProvider>
                    <App />

                    <Toaster
                      position="top-right"
                      richColors
                    />
                  </OrganizationProvider>
                </OvertimeProvider>
              </PermissionProvider>
            </LeaveProvider>
          </AttendanceProvider>
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)