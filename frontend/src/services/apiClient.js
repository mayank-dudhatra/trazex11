import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const requestUrl = config.url || ''

  if (
    typeof requestUrl === 'string' &&
    !/^https?:\/\//i.test(requestUrl) &&
    !requestUrl.startsWith('/api')
  ) {
    config.url = `/api${requestUrl.startsWith('/') ? '' : '/'}${requestUrl}`
  }

  return config
})

export default apiClient
