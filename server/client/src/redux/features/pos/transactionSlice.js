import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transaction: localStorage.getItem("transaction")
      ? JSON.parse(localStorage.getItem("transaction"))
      : null,
    allTransaction: [],
    queryTransaction: [],
    pageCount: 1,
  },
  reducers: {
    setTransaction: (state, action) => {
      state.transaction = action.payload;
      localStorage.setItem("transaction", JSON.stringify(action.payload));
    },
    setAllTransaction: (state, action) => {
      state.allTransaction = action.payload;
    },
    setQueryTransaction: (state, action) => {
      state.queryTransaction = action.payload;
    },
    removeQueryTransaction: (state) => {
      state.queryTransaction = [];
    },
    removeTransaction: (state) => {
      state.transaction = null;
      localStorage.removeItem("transaction");
    },

    pageCountIncrement: (state) => {
      state.pageCount = state.pageCount + 1;
    },
    pageCountDecrement: (state) => {
      state.pageCount = state.pageCount - 1;
    },
    setPageCount: (state, action) => {
      state.pageCount = action.payload;
    },
  },
});

export const {
  setTransaction,
  removeTransaction,
  setAllTransaction,
  removeQueryTransaction,
  setQueryTransaction,
  pageCountIncrement,
  pageCountDecrement,
  setPageCount,
} = transactionSlice.actions;
export default transactionSlice.reducer;
