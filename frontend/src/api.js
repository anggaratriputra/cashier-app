import axios from "axios";

let baseURL = "http://localhost:8000";
const token = JSON.parse(localStorage.getItem('profile'))?.data?.token;

const instance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default instance;