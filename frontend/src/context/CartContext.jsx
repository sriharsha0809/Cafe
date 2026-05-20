import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_ID_KEY = 'chaiopod_cart_id';

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART_ID':
      return { ...state, cartId: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ORDER_TYPE':
      return { ...state, orderType: action.payload };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cartId: null,
    items: [],
    loading: false,
    orderType: 'dine-in',
  });

  // Initialize cart
  useEffect(() => {
    const init = async () => {
      let cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) {
        const res = await cartApi.create('guest');
        cartId = res.data.data.cart_id;
        localStorage.setItem(CART_ID_KEY, cartId);
      }
      dispatch({ type: 'SET_CART_ID', payload: cartId });
      fetchCart(cartId);
    };
    init();
  }, []);

  const fetchCart = useCallback(async (cartId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await cartApi.get(cartId);
      dispatch({ type: 'SET_ITEMS', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addToCart = useCallback(async (item, priceChosen) => {
    if (!state.cartId) return;
    try {
      await cartApi.addItem(state.cartId, item.id, 1, priceChosen || item.price);
      await fetchCart(state.cartId);
      toast.success(`${item.name} added to cart!`, {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        iconTheme: { primary: '#E63946', secondary: '#fff' },
      });
    } catch (err) {
      toast.error('Failed to add item');
    }
  }, [state.cartId, fetchCart]);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      await cartApi.updateItem(cartItemId, quantity);
      await fetchCart(state.cartId);
    } catch (err) {
      toast.error('Failed to update cart');
    }
  }, [state.cartId, fetchCart]);

  const removeItem = useCallback(async (cartItemId) => {
    try {
      await cartApi.removeItem(cartItemId);
      await fetchCart(state.cartId);
      toast.success('Item removed', {
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
    } catch (err) {
      toast.error('Failed to remove item');
    }
  }, [state.cartId, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!state.cartId) return;
    try {
      await cartApi.clear(state.cartId);
      dispatch({ type: 'CLEAR' });
    } catch (err) {
      console.error(err);
    }
  }, [state.cartId]);

  const setOrderType = (type) => dispatch({ type: 'SET_ORDER_TYPE', payload: type });

  const total = state.items.reduce((sum, item) => sum + item.price_chosen * item.quantity, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartId: state.cartId,
      items: state.items,
      loading: state.loading,
      orderType: state.orderType,
      total,
      itemCount,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      setOrderType,
      refreshCart: () => fetchCart(state.cartId),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
