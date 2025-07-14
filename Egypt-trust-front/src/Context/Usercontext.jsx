import { createContext, useState } from 'react'

export const UserContext = createContext()

export default function UserProvider ({ children }) {
  const [userRole, setUserRole] = useState(null)
  const [userId, setuserId] = useState(null)

  return <UserContext.Provider value={{ userRole, setUserRole,userId, setuserId}}>
           {children}
         </UserContext.Provider>
}
