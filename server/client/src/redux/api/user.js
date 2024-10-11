import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: (data) => ({
        url: "/api/users/create",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "api/users/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useCreateAccountMutation, useLoginMutation, useLogoutMutation } =
  userApiSlice;
