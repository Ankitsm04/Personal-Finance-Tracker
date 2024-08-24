import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_API_KEY}/` }),
  endpoints: (builder) => ({
    getExchangeRates: builder.query({
      query: (base) => `latest/${base}`,
    }),
  }),
});

export const { useGetExchangeRatesQuery } = api;
