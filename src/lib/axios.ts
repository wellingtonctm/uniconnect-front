import axios from "axios";

export default axios.create({
    baseURL: 'https://uniconnect-back.up.railway.app',
    headers: {
        'Content-Type': 'application/json'
    }
})