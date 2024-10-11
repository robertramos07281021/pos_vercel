import { createSlice } from "@reduxjs/toolkit";

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    stock: [],
    filteredStock: [],
  },
  reducers: {
    setStock: (state, action) => {
      state.stock = action.payload;
    },
    setFilteredStock: (state, action) => {
      state.filteredStock = action.payload;
    },
    removeStock: (state) => {
      state.stock = [];
    },
  },
});

export const { setStock, removeStock, setFilteredStock } = stockSlice.actions;
export default stockSlice.reducer;
