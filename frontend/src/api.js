import axios from "axios";


let baseURL = "http://localhost:8000";
// if (process.env.NODE_ENV === "production") {
//   baseURL = ""
// }
const instance = axios.create({
  baseURL,
});

export default instance;

