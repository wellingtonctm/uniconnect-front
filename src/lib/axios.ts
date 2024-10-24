import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

console.log(apiUrl);

export default axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})