import { apiSlice } from "./apiSlice";

export const posApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: ({ firstname, lastname }) => ({
        url: "/api/productions/customer",
        method: "POST",
        body: { firstname, lastname },
      }),
    }),
    newTransaction: builder.mutation({
      query: (customer_id) => ({
        url: "/api/productions/transaction",
        method: "POST",
        body: { customer_id },
      }),
    }),
    allProduct: builder.query({
      query: () => "/api/productions/product",
    }),
    getTransaction: builder.query({
      query: (id) => `/api/productions/transaction/${id}`,
    }),
    createOrder: builder.mutation({
      query: ({ transaction_id, barcode, qty }) => ({
        url: "/api/productions/order",
        method: "POST",
        body: { transaction_id, barcode, qty },
      }),
    }),
    findTransactionOrder: builder.query({
      query: (transaction_id) => `/api/productions/order/${transaction_id}`,
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/productions/order/${orderId}`,
        method: "DELETE",
      }),
    }),
    transactionGrandTotal: builder.query({
      query: (transactionId) =>
        `/api/productions/transaction/sum/${transactionId}`,
    }),
    payment: builder.mutation({
      query: ({ id, cash }) => ({
        url: `/api/productions/payment/${id}`,
        method: `PUT`,
        body: { cash },
      }),
    }),
    cancelCustomer: builder.mutation({
      query: (customerId) => ({
        url: `/api/productions/customer/${customerId}`,
        method: "DELETE",
      }),
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/api/productions/product",
        method: "POST",
        body: data,
      }),
    }),
    newStock: builder.mutation({
      query: ({ productId, qty }) => ({
        url: `/api/productions/stock/${productId}`,
        method: "POST",
        body: { qty },
      }),
    }),
    getAllStocks: builder.query({
      query: () => "/api/productions/stocks",
    }),
    updateProduct: builder.mutation({
      query: ({ data, productId }) => ({
        url: `/api/productions/product/${productId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateStock: builder.mutation({
      query: ({ qty, stockId }) => ({
        url: `/api/productions/stock/${stockId}`,
        method: "PATCH",
        body: { qty },
      }),
    }),
    lockedStock: builder.mutation({
      query: (id) => ({
        url: `/api/productions/stock/${id}/locked`,
        method: "PUT",
      }),
    }),
    unlockedStock: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/productions/stock/${id}/unlocked`,
        method: "PUT",
        body: data,
      }),
    }),
    ascendingStock: builder.query({
      query: () => `/api/productions/stocks/ascending`,
    }),
    descendingStock: builder.query({
      query: () => `/api/productions/stocks/descending`,
    }),
    getAllTransactions: builder.query({
      query: () => "/api/productions/transactions",
    }),
    salesToday: builder.query({
      query: () => "/api/productions/sales/today",
    }),
    salesRange: builder.mutation({
      query: (data) => ({
        url: "/api/productions/sales",
        method: "POST",
        body: data,
      }),
    }),
    salesYear: builder.mutation({
      query: (year) => ({
        url: "/api/productions/sales/year",
        method: "POST",
        body: year,
      }),
    }),
    salesStockSort: builder.mutation({
      query: (sort) => ({
        url: `/api/productions/stocks/stock-sort`,
        method: "POST",
        body: sort,
      }),
    }),
    transactionPages: builder.query({
      query: (id) => `/api/productions/transactions/page/${id}`,
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useNewTransactionMutation,
  useAllProductQuery,
  useCreateOrderMutation,
  useFindTransactionOrderQuery,
  useDeleteOrderMutation,
  useTransactionGrandTotalQuery,
  usePaymentMutation,
  useGetTransactionQuery,
  useCancelCustomerMutation,
  useCreateProductMutation,
  useNewStockMutation,
  useGetAllStocksQuery,
  useUpdateProductMutation,
  useUpdateStockMutation,
  useLockedStockMutation,
  useUnlockedStockMutation,
  useDescendingStockQuery,
  useAscendingStockQuery,
  useGetAllTransactionsQuery,
  useSalesTodayQuery,
  useSalesRangeMutation,
  useSalesYearMutation,
  useSalesStockSortMutation,
  useTransactionPagesQuery,
} = posApiSlice;
