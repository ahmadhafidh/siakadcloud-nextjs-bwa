import axios from 'axios'

function getTokenFromCookies(): string | null {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null
}

// Buat instance axios
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, //ganti variabel sesuai yg didefinisikan di .env
})

// Interceptor untuk setiap request
api.interceptors.request.use(
    (config) => {
        const token = getTokenFromCookies();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

export default api