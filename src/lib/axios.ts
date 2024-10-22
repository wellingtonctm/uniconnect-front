import axios from "axios";

export default axios.create({
    baseURL: 'http://192.168.1.100:5103',
    headers: {
        'Content-Type': 'application/json'
    }
})