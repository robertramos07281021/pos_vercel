import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: localStorage.getItem("orders")
      ? JSON.parse(localStorage.getItem("orders"))
      : [],
    updatingOrder: {
      barcode: "",
      qty: 0,
    },
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      localStorage.setItem("orders", JSON.stringify(action.payload));
    },
    setUpdatingOrder: (state, action) => {
      state.updatingOrder = { ...state.updatingOrder, ...action.payload };
    },
    removeOrders: (state) => {
      state.orders = [];
    },
  },
});

export const { setOrders, setUpdatingOrder, removeOrders } = orderSlice.actions;
export default orderSlice.reducer;
