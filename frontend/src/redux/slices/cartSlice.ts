import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItemDto } from '../../models/Cart';

interface CartState {
  items: CartItemDto[];
  isCheckoutComplete: boolean; 
}

const initialState: CartState = {
  items: [],
  isCheckoutComplete: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItemDto[]>) {
      state.items = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.isCheckoutComplete = true; 
    },
    resetCart(state) {
      state.isCheckoutComplete = false;
    }
  },
});

export const { setCartItems, clearCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
