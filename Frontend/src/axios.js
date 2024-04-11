import axios from "axios"
console.log("BACKEND_URL:", process.env.REACT_APP_BACKEND_URL); // Debug statement
const instance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}api` || 'http://localhost:4000/api'
    //baseURL: 'http://localhost:4000/api'
})

export default instance