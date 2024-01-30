import axios from "axios";

export default axios.create({
    baseURL: `https://api.pandascore.co/`,
    headers: {
        "Accept": "application/json",
        "Authorization": "Bearer 8z8A5KhVxBJxlKZIBJpsZqSqdSJiwOBoO0U7qMZDdnGJm7IPWAg"
    }
});