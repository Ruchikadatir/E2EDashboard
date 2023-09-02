import axios from "axios";
import { toast } from "react-toastify";

console.log(process.env);
let baseURL = process.env.REACT_APP_API_BASE_URL;

console.log("Environment: ", process.env.NODE_ENV);
console.log(`Base URL: ${baseURL}`);
console.log("-------------------");

const http = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
});

const httpFile = axios.create({
  baseURL: baseURL + "/api",
  responseType: "blob",
  timeout: 10000,
});

http.interceptors.response.use(
  responseInterceptorHandler,
  responseInterceptorErrorHandler
);
http.interceptors.request.use(
  requestInterceptorHandler,
  requestInterceptorErrorHandler
);
httpFile.interceptors.response.use(
  responseInterceptorHandler,
  responseInterceptorErrorHandler
);
httpFile.interceptors.request.use(
  requestInterceptorHandler,
  requestInterceptorErrorHandler
);

function requestInterceptorHandler(config) {
  //Do something here before the request is sent
  return config;
}

function requestInterceptorErrorHandler(error) {
  //Do something here when the request has an error
  toast.error(error.message, { theme: "dark" });
  return Promise.reject(error);
}

function responseInterceptorHandler(response) {
  //do nothing
  return response;
}

function responseInterceptorErrorHandler(error) {
  console.log("------------");
  console.log(error);
  console.log(error.response);
  console.log(error.request);
  console.log(error.message);
  console.log("-----------------");
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    toast.error(error.response.data, { theme: "colored" });
    console.log(error.response);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    toast.error(error.request, { theme: "colored" });
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    toast.error(error.message, { theme: "colored" });
    console.log("Error", error.message);
  }
  console.log(error.config);
  return Promise.reject(error);
}

export { http, httpFile };
