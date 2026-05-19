import axios from 'axios'

console.log("BASE URL:", import.meta.env.VITE_BASE_URL);
const base = (import.meta.env.VITE_BASE_URL || "http://localhost:5000")
  .replace(/\/+$/, "");   

const api = axios.create({
  baseURL: base + "/api",
  withCredentials: true,
});
//auth token for all api request
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config;
})
export default api;