import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { Address } from '@/lib/supabase';

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: addressesError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (addressesError) {
        throw addressesError;
      }

      setAddresses(data || []);
    } catch (err) {
      
      setError(err instanceof Error ? err : new Error('Failed to fetch addresses'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addAddress = useCallback(async (address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      throw new Error('You must be logged in to add an address');
    }

    try {
      setError(null);
      
      // First verify the user session is active
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Authentication session expired');
      }

      const { data, error: addError } = await supabase
        .from('addresses')
        .insert([
          {
            user_id: user.id,
            ...address,
          },
        ])
        .select()
        .single();

      if (addError) {
        console.error('Database error adding address:', addError);
        throw addError;
      }

      if (!data) {
        throw new Error('No data returned after adding address');
      }

      setAddresses(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error in addAddress:', err);
      throw err;
    }
  }, [user]);

  const updateAddress = useCallback(async (id: string, updates: Partial<Address>) => {
    if (!user) {
      throw new Error('You must be logged in to update an address');
    }

    try {
      setError(null);
      
      // First verify the user session is active
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Authentication session expired');
      }

      const { data, error: updateError } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Database error updating address:', updateError);
        throw updateError;
      }

      if (!data) {
        throw new Error('No data returned after updating address');
      }

      setAddresses(prev => prev.map(addr => addr.id === id ? data : addr));
      return data;
    } catch (err) {
      console.error('Error in updateAddress:', err);
      throw err;
    }
  }, [user]);

  const deleteAddress = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('You must be logged in to delete an address');
    }

    try {
      setError(null);
      
      // First verify the user session is active
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Authentication session expired');
      }

      const { error: deleteError } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Database error deleting address:', deleteError);
        throw deleteError;
      }

      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
      console.error('Error in deleteAddress:', err);
      throw err;
    }
  }, [user]);

  const setDefaultAddress = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('You must be logged in to set a default address');
    }

    try {
      setError(null);
      
      // First verify the user session is active
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Authentication session expired');
      }

      // First, remove default from all addresses
      const { error: updateAllError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
        
      if (updateAllError) {
        console.error('Error removing default status from addresses:', updateAllError);
        throw updateAllError;
      }

      // Then set the new default
      const { data, error: updateError } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error setting default address:', updateError);
        throw updateError;
      }

      if (!data) {
        throw new Error('No data returned after setting default address');
      }

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === id
      })));

      return data;
    } catch (err) {
      console.error('Error in setDefaultAddress:', err);
      throw err;
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [user, fetchAddresses]);

  return {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch: fetchAddresses,
  };
}