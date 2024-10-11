import { createSlice } from "@reduxjs/toolkit";

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    sales: [],
    monthlySales: [],
    yearlySales: {},
  },
  reducers: {
    setSales: (state, action) => {
      state.sales = action.payload;
    },
    setMonthlySales: (state, action) => {
      state.monthlySales = action.payload;
    },
    setYearlySales: (state, action) => {
      state.yearlySales = action.payload;
    },
    removeSales: (state) => {
      state.sales = [];
    },
  },
});

export const { setSales, removeSales, setMonthlySales, setYearlySales } =
  salesSlice.actions;
export default salesSlice.reducer;
