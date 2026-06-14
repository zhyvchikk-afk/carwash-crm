import axios from 'axios'


const api = axios.create({
    baseURL: 'http://192.168.0.198:8000/api',
})

let isRefreshing = false


api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})


api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            if (isRefreshing) {
                await new Promise(resolve => setTimeout(resolve, 500))
                originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
                return axios(originalRequest)
            }

            isRefreshing = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')

                const response = await axios.post(
                    'http://127.0.0.1:8000/api/auth/refresh/',
                    {
                        refresh: refreshToken
                    },
                )

                const newAccessToken = response.data.access

                localStorage.setItem(
                    'accessToken',
                    newAccessToken,
                )

                if (response.data.refresh) {
                    localStorage.setItem('refreshToken', response.data.refresh)
                }

                isRefreshing = false

                originalRequest.headers.Authorization = 
                `Bearer ${newAccessToken}`

                return api(originalRequest)
            } catch (refreshError) {
                isRefreshing = false
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')

                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    },
)

export default api