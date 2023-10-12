import axios from "axios";

let baseURL = "http://localhost:8000";
const token = localStorage.getItem('profile.data.token')
// if (process.env.NODE_ENV === "production") {
//   baseURL = ""
// }
const instance = axios.create({
  baseURL,
 headers: {
 Authorization: `Bearer ${token}`
 }
});

export default instance;

