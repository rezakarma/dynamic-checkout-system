import { configureStore } from "@reduxjs/toolkit";
import cartSlice, { Cart } from "./cart-slice";

export interface RootState {
  cart: Cart
}
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export default store;