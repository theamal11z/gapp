// This file now re-exports from the CartContext to maintain backward compatibility
import { useCart as useCartFromContext, CartItemWithProduct, Coupon } from '@/lib/CartContext';

export type { CartItemWithProduct, Coupon };

export function useCart() {
  const cartContext = useCartFromContext();
  
  return cartContext;
}