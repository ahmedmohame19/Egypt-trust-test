import { useContext } from 'react'
import { UserContext } from '../Context/Usercontext'

export const useRoleBasedRoute = () => {
  const { userRole } = useContext(UserContext)

  const getRoute = (path) => {
    if (userRole === 'Admin') {
      return path === '' ? '/' : `/${path}`
    } else if (userRole === 'WarehouseAdmin') {
      return path === '' ? '/WarehouseAdmin' : `/WarehouseAdmin/${path}`
    } else if (userRole === 'BranchAdmin') {
      return path === '' ? '/BranchAdmin' : `/BranchAdmin/${path}`
    }
    return path === '' ? '/' : `/${path}`
  }

  return { getRoute}
}
