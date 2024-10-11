import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "./features/auth/authSlice";
import { apiSlice } from "./api/apiSlice";
import customerReducer from "./features/customer/customerSlice";
import orderReducer from "./features/pos/orderSlice";
import transactionReducer from "./features/pos/transactionSlice";
import stockReducer from "./features/pos/stockSlice";
import productReducer from "./features/pos/productSlice";
import salesReducer from "./features/pos/salesSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    customer: customerReducer,
    orders: orderReducer,
    transaction: transactionReducer,
    stock: stockReducer,
    product: productReducer,
    sales: salesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
