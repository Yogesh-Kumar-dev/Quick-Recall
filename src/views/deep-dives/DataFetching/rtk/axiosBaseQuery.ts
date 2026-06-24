// Custom axios-backed baseQuery for RTK Query. RTK Query ships fetchBaseQuery
// (which uses the native fetch API); we swap in axios so this variant uses the
// same transport as the TanStack demo. A baseQuery is just a function that
// returns either { data } on success or { error } on failure.
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

export interface AxiosBaseQueryError {
  status?: number;
  data?: unknown;
}

export function axiosBaseQuery(
  { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> {
  return async ({ url, method, data, params }) => {
    try {
      const result = await axios({ url: baseUrl + url, method: method ?? 'get', data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      // Normalize the error into RTK Query's { error } channel so isError /
      // error are populated on the hook.
      return { error: { status: err.response?.status, data: err.response?.data ?? err.message } };
    }
  };
}
