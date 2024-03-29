import axios from "axios";

const baseURL = import.meta.env.VITE_APP_API_URL;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.reload(true);
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
