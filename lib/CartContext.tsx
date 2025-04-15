import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { CartItem, Product } from '@/lib/supabase';

export type CartItemWithProduct = CartItem & {
  product: Product;
};

// Define Coupon type
export interface Coupon {
  id: string;
  code: string;
  discount: number | string;
  description?: string;
  min_purchase_amount?: number;
  max_discount_amount?: number;
}

interface CartContextType {
  cartItems: CartItemWithProduct[];
  loading: boolean;
  error: Error | null;
  fetchCartItems: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<any>;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  getCartTotals: () => { subtotal: number; itemCount: number; discountAmount: number; discountedSubtotal: number };
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<Coupon | null>;
  removeCoupon: () => void;
}

// Export the context so it can be imported directly if needed
export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Fetch cart items with product details
  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      // First check if the cart_items table exists
      const { error: tableCheckError } = await supabase
        .from('cart_items')
        .select('id')
        .limit(1);

      if (tableCheckError) {
        throw new Error(`Cart functionality is unavailable: ${tableCheckError.message}`);
      }

      // Fetch cart items with product details
      const { data, error: fetchError } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Check for missing product data which might indicate a relationship issue
      const hasInvalidItems = data.some(item => !item.product);
      if (hasInvalidItems) {
        // Skip console warning
      }

      // Transform the data to match CartItemWithProduct type
      const transformedData = data.map((item: any) => ({
        ...item,
        product: item.product
      }));

      setCartItems(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cart items'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add item to cart
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (!user) return null;

    try {
      setError(null);

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity if item already exists
        const { data, error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select(`
            *,
            product:products(*)
          `)
          .single();

        if (updateError) throw updateError;
        
        // Update local state
        setCartItems(prev => 
          prev.map(item => 
            item.id === existingItem.id 
              ? { ...data, product: data.product } 
              : item
          )
        );
        
        return data;
      } else {
        // Insert new item if it doesn't exist
        const { data, error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          })
          .select(`
            *,
            product:products(*)
          `)
          .single();

        if (insertError) throw insertError;
        
        // Update local state
        setCartItems(prev => [{ ...data, product: data.product }, ...prev]);
        
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add item to cart'));
      return null;
    }
  }, [user]);

  // Update cart item quantity
  const updateCartItemQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    if (!user || quantity < 1) return false;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity } 
            : item
        )
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update cart item quantity'));
      return false;
    }
  }, [user]);

  // Remove item from cart
  const removeFromCart = useCallback(async (cartItemId: string) => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove item from cart'));
      return false;
    }
  }, [user]);

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Update local state
      setCartItems([]);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear cart'));
      return false;
    }
  }, [user]);

  // Calculate cart totals
  const getCartTotals = useCallback(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity, 
      0
    );
    
    const itemCount = cartItems.reduce(
      (sum, item) => sum + item.quantity, 
      0
    );
    
    // Calculate discount if a coupon is applied
    let discountAmount = 0;
    let discountedSubtotal = subtotal;
    
    if (appliedCoupon) {
      if (typeof appliedCoupon.discount === 'number') {
        // Percentage discount
        discountAmount = (subtotal * appliedCoupon.discount) / 100;
        
        // Apply max discount cap if it exists
        if (appliedCoupon.max_discount_amount && discountAmount > appliedCoupon.max_discount_amount) {
          discountAmount = appliedCoupon.max_discount_amount;
        }
      } else if (typeof appliedCoupon.discount === 'string') {
        // Fixed amount discount
        const fixedDiscount = parseFloat(appliedCoupon.discount);
        if (!isNaN(fixedDiscount)) {
          discountAmount = fixedDiscount;
        }
      }
      
      discountedSubtotal = subtotal - discountAmount;
    }
    
    return {
      subtotal,
      itemCount,
      discountAmount,
      discountedSubtotal
    };
  }, [cartItems, appliedCoupon]);

  // Apply coupon code
  const applyCoupon = useCallback(async (code: string): Promise<Coupon | null> => {
    if (!user || !code.trim()) return null;
    
    try {
      // Use the RPC function to check if coupon is valid for this user
      const { data: validationResult, error: validationError } = await supabase
        .rpc('is_coupon_valid_for_user', {
          p_coupon_code: code.trim(),
          p_user_id: user.id
        });
      
      if (validationError) throw validationError;
      
      // If coupon is not valid, throw the error with the reason
      if (!validationResult.valid) {
        throw new Error(validationResult.message || 'Invalid coupon code');
      }
      
      // Extract the offer data from the validation result
      const offerData = validationResult.offer;
      
      // Check if coupon has minimum purchase requirement
      if (offerData.min_purchase_amount) {
        const { subtotal } = getCartTotals();
        if (subtotal < offerData.min_purchase_amount) {
          throw new Error(`Minimum purchase of ₹${offerData.min_purchase_amount} required to use this coupon`);
        }
      }
      
      // Format the coupon data to match our Coupon interface
      const formattedCoupon: Coupon = {
        id: offerData.id,
        code: offerData.code,
        discount: offerData.coupon_type === 'percent' ? 
          parseFloat(offerData.discount.replace(/[^0-9.]/g, '')) : 
          offerData.discount,
        description: offerData.description,
        min_purchase_amount: offerData.min_purchase_amount,
        max_discount_amount: offerData.max_discount_amount
      };
      
      // Apply the coupon
      setAppliedCoupon(formattedCoupon);
      return formattedCoupon;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to apply coupon'));
      throw err; // Re-throw to allow the caller to handle specific error messages
    }
  }, [user, getCartTotals]);
  
  // Remove applied coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Set up real-time subscription to cart changes
  useEffect(() => {
    if (!user) return;

    // Fetch initial cart items
    fetchCartItems();

    // Set up subscription to cart_items table for real-time updates
    const cartSubscription = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refresh cart items when changes are detected
          fetchCartItems();
        }
      )
      .subscribe();

    setSubscription(cartSubscription);

    // Clean up subscription on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user, fetchCartItems]);

  // Export the necessary values
  const value = {
    cartItems,
    loading,
    error,
    fetchCartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Export the useCart hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}