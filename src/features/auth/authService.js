import axios from 'axios'

const API_URL = '/api/'

// Registration
const register = async (userInfo) => {
  const response = await axios.post(`${API_URL}users/register`, userInfo)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Sign in user
const login = async (userInfo) => {
  const response = await axios.post(`${API_URL}auth/login`, userInfo)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const logout = async () => {
  localStorage.removeItem('user')
  // TODO: Invalidate cookies from server
}

const authService = {
  register,
  login,
  logout,
}

export default authService
