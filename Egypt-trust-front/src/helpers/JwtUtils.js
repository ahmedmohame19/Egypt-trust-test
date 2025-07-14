import { jwtDecode } from 'jwt-decode'

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return exp < currentTime
  } catch (error) {
    console.error('Invalid token:', error)
    return true
  }
}
