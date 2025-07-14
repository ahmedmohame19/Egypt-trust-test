import { createHashRouter, RouterProvider } from 'react-router-dom'
import './App.scss'
import MainLayOut from './pages/MainLayOut'
import Home from './pages/Home/Home'
import { Suspense, useContext, useEffect } from 'react'

import LoginProtector from './components/Protectors/LoginProtector'
import Login from './pages/Auth/Login/Login'
import RoleProtector from './components/Protectors/Roleprotector'
import { jwtDecode } from 'jwt-decode'
import { UserContext } from './Context/Usercontext'
import Warehouses from './pages/Admin/warehouses/Warehouses.jsx'
import WarehousesAdmins from './pages/Admin/WarehousesAdmins/WarehousesAdmins';
import BranchAdmins from './pages/Admin/BranchAdmin/BranchAdmins.jsx'
import Branches from './pages/Admin/Branches/Branches.jsx'

function App() {
  const { userRole, setUserRole } = useContext(UserContext)

  useEffect(() => {
    // console.clear();
    const token = localStorage.getItem('Egypt-Trust-Token')
    if (token) {
      const decodedToken = jwtDecode(token)
      const { role } = decodedToken
      setUserRole(role)
    }

  }, [userRole]);

  const routes = createHashRouter([
    // Admin routes
    {
      path: '', element: <MainLayOut role='Admin' />, children: [
        {
          index: true, element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <Home />
              </RoleProtector>
            </LoginProtector>
        },
        // Warehouse Management
        {
          path: 'warehouses', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <Warehouses />
              </RoleProtector>
            </LoginProtector>
        },
        // Branch Management
        {
          path: 'branches', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <Branches />
              </RoleProtector>
            </LoginProtector>
        },
        // Token Management
        {
          path: 'tokens', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Token Management</h1>
                  <p>Manage electronic signature tokens, assignments, and bulk operations.</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        },
        // Request Management
        {
          path: 'requests', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Request Management</h1>
                  <p>Approve, reject, and manage all system requests.</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        },
        // Reports
        {
          path: 'comprehensive-reports', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Comprehensive Reports</h1>
                  <p>View comprehensive system reports and analytics.</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        },
        {
          path: 'inventory-reports', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Inventory Reports</h1>
                  <p>View detailed inventory reports and status.</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        },
        {
          path: 'usage-reports', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Usage Reports</h1>
                  <p>View usage statistics and patterns.</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        },
        {
          path: 'shortage-reports', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Shortage Reports</h1>
                  <p>View shortage alerts and inventory gaps.</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        },
        // User Management
        {
          path: 'warehouse-admins', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <WarehousesAdmins />
              </RoleProtector>
            </LoginProtector >
        },
        {
          path: 'branch-admins', element:
            <LoginProtector>
              <RoleProtector requiredRole='Admin'>
                <BranchAdmins />
              </RoleProtector>
            </LoginProtector>
        }
      ]
    },

    // WarehouseAdmin routes
    {
      path: 'WarehouseAdmin', element: <MainLayOut role='WarehouseAdmin' />, children: [
        {
          index: true, element: <LoginProtector>
            <RoleProtector requiredRole='WarehouseAdmin'>
              <Home />
            </RoleProtector>
          </LoginProtector>
        },
        {
          path: 'requests', element:
            <LoginProtector>
              <RoleProtector requiredRole='WarehouseAdmin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">request-tokens</h1>
                  <p>request-tokens</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        },
        {
          path: 'add-tokens', element:
            <LoginProtector>
              <RoleProtector requiredRole='WarehouseAdmin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">request-tokens</h1>
                  <p>request-tokens</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        }
      ]
    },
    // BranchAdmin
    {
      path: 'BranchAdmin', element: <MainLayOut role='BranchAdmin' />, children: [
        {
          index: true, element: <LoginProtector>
            <RoleProtector requiredRole='BranchAdmin'>
              <Home />
            </RoleProtector>
          </LoginProtector>
        },
        {
          path: 'requests', element:
            <LoginProtector>
              <RoleProtector requiredRole='BranchAdmin'>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">request-tokens</h1>
                  <p>request-tokens</p>
                </div>
              </RoleProtector>
            </LoginProtector>
        }
      ]
    },
    {
      path: "Login", element: <Suspense><Login /></Suspense>
    },
  ])

  return <>
    <RouterProvider router={routes} />
  </>
}

export default App