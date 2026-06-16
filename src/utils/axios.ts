'use client';

/**
 * axios setup to use mock service
 */

import axios, { AxiosRequestConfig } from 'axios';

const axiosServices = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;

export async function fetcher(args: string | [string, AxiosRequestConfig]) {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
}
