import axios from "axios";

const instance = axios.create({
  timeout: 10000,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
