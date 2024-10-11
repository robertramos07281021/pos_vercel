import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
  },
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    removeProduct: (state) => {
      state.product = [];
    },
  },
});

export const { setProduct, removeProduct } = productSlice.actions;
export default productSlice.reducer;
