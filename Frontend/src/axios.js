import axios from "axios"

const instance = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:4000/'
})

export default instance