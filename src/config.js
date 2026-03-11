import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
  //  baseURL: import.meta.env.VITE_API_BASE_URL

                          // baseURL: 'http://localhost:5000/api'
                         baseURL: 'http://103.175.190.244/api'

};

export default config;
