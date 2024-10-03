import {
  addProductToCart,
  getCart,
  removeProductFromCart,
  clearProductCart,
} from "@/actions/cart.atcions";
import {
  CouponCodes,
  PricingRule,
  Product,
  ProductInCart,
} from "@prisma/client";
import { toast } from "sonner";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCouponCode } from "@/actions/couponCode.action";

export type ProductInCartInterface = ProductInCart & {
  product: Product & {
    pricingRules: PricingRule[];
  };
};

export interface Cart {
  products:
    | (ProductInCart & {
        product: Product & {
          pricingRules: PricingRule[];
        };
      })[]
    | [];
  isLoading: string | boolean;
  isLoadingClearCart: boolean;
  error: { error: string } | string | null| undefined
  couponCode: CouponCodes | null;
  success: { success: string } | string | null | undefined
}

const initialState: Cart = {
  products: [],
  couponCode: null,
  isLoading: false,
  isLoadingClearCart: false,
  error: null,
  success: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserCart.fulfilled, (state, action) => {
      state.products = action.payload ? action.payload.products : [];
      state.isLoading = false;
    });
    builder.addCase(getUserCart.pending, (state: Cart) => {
      state.isLoading = true;
    });
    builder.addCase(addProduct.fulfilled, (state: Cart, action) => {
      state.error = null;
      const newProduct = action?.payload?.product
      const productExistIndex = state.products.findIndex(
        (product) => product.id === newProduct?.id
      );
      if (productExistIndex === -1) {
        state.products.push(newProduct);
      } else {
        state.products[productExistIndex] = newProduct 
      }
      state.success = action?.payload?.success
      state.isLoading = false;
    });
    builder.addCase(addProduct.pending, (state: Cart) => {
      state.isLoading = true;
    });
    builder.addCase(addProduct.rejected, (state: Cart, action) => {
      state.error = action.payload as string | { error: string };
      state.isLoading = false;
    });
    builder.addCase(removeProduct.fulfilled, (state: Cart, action) => {
      state.error = null;
      const newProduct = action.payload.product;
      const productExistIndex = state.products.findIndex(
        (product) => product.id === newProduct.id
      );

      if (productExistIndex === -1) {
        state.error = { error: "این محصول در سبد خرید وجود ندارد" };
      } else {
        if (state.products[productExistIndex].count > 1) {
          state.products[productExistIndex] = newProduct;
        } else {
          state.products.splice(productExistIndex, 1);
        }
      }

      state.success = action.payload.success;
      state.isLoading = false;
    });
    builder.addCase(removeProduct.rejected, (state, action) => {
      state.error = action.payload as string | { error: string };
      state.isLoading = false;
    });
    builder.addCase(removeProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(clearCart.fulfilled, (state) => {
      state.products = [];
      state.isLoadingClearCart = false;
    });
    builder.addCase(clearCart.pending, (state) => {
      state.isLoadingClearCart = true;
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.error = action.payload as string | { error: string };
      state.isLoadingClearCart = false;
    });
    builder.addCase(applyCouponCode.fulfilled, (state, action) => {
      state.couponCode = action.payload.couponCode;
    });
    builder.addCase(applyCouponCode.rejected, (state, action) => {
      state.error = action.payload as string | { error: string };
    });
  },
});

export const getUserCart = createAsyncThunk("cart/getUserCart", async () => {
  const response = await getCart();
  return response;
});

export const addProduct = createAsyncThunk(
  "cart/addProduct",
  async (data: { productId: string; type: "byId" | "SKU" }, thunkAPI) => {
    const response = await addProductToCart(data.type, data.productId);
    console.log(response, " this is from addProduct to car");

    if (response.error) {
      toast.error(response.error);
      return thunkAPI.rejectWithValue(response.error);
    } else if (response.success) {
      toast.success(response.success);
      return response;
    }
  }
);

export const removeProduct = createAsyncThunk(
  "cart/removeProduct",
  async (productId: string) => {
    const response = await removeProductFromCart(productId);
    console.log(response, " this is from addProduct to car");
    if (response.error) {
      toast.error(response.error);
      return thunkAPI.rejectWithValue(response);
    } else if (response.success) {
      toast.success(response.success);
      return response;
    }
  }
);

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  const response = await clearProductCart();
  if (response.error) {
    toast.error(response.error);
    return thunkAPI.rejectWithValue(response);
  } else if (response.success) {
    toast.success("cart cleared");
    return response;
  }
});

export const applyCouponCode = createAsyncThunk(
  "cart/applyCouponCode",
  async (code: string) => {
    console.log("ruuun this line");
    const response = await getCouponCode(code);
    console.log();
    if (response.error) {
      toast.error(response.error);
      return thunkAPI.rejectWithValue(response);
    } else if (response.success) {
      toast.success("coupon code applied");
      return response;
    }
  }
);

export default cartSlice;
export const cartSliceAction = cartSlice.actions;
