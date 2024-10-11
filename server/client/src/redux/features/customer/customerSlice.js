import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customerInfo: localStorage.getItem("customer")
      ? JSON.parse(localStorage.getItem("customer"))
      : null,
  },
  reducers: {
    setCustomerInfo: (state, action) => {
      state.customerInfo = action.payload;
      localStorage.setItem("customer", JSON.stringify(action.payload));
    },
    removeCustomerInfo: (state) => {
      state.customerInfo = null;
      localStorage.removeItem("customer");
    },
  },
});

export const { setCustomerInfo, removeCustomerInfo } = customerSlice.actions;
export default customerSlice.reducer;
