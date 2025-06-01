// hooks/useCrud.ts
import { useState, useEffect, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

// Define a generic type for items, assuming they always have an 'id'
interface CrudItem {
  id: number;
  [key: string]: any; // Allow other properties
}

interface UseCrudOptions {
  itemsPerPage?: number;
  orderBy?: { column: string; ascending: boolean };
  // Add other options as needed, e.g., default filters
}

// Function signature for a generic Supabase table
type SupabaseTable<T extends CrudItem> = ReturnType<SupabaseClient['from'] & ((tableName: string) => any)>;

/**
 * A generic React hook for performing CRUD operations with Supabase, including pagination and real-time updates.
 *
 * @param supabase The Supabase client instance.
 * @param tableName The name of the table in your Supabase database.
 * @param options Configuration options like itemsPerPage and orderBy.
 * @returns An object containing data, loading state, error, CRUD functions, and pagination controls.
 */
const useCrud = <T extends CrudItem>(
  supabase: SupabaseClient,
  tableName: string,
  options?: UseCrudOptions
) => {
  const { itemsPerPage = 5, orderBy = { column: 'id', ascending: true } } = options || {};

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  // Calculate total pages based on current count and items per page
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  // --- Data Fetching Logic ---
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch total count of items
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalItemsCount(count || 0);

      // Calculate offset for the current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage - 1;

      // 2. Fetch items for the current page
      const { data: fetchedData, error: dataError } = await supabase
        .from(tableName)
        .select('*')
        .order(orderBy.column, { ascending: orderBy.ascending })
        .range(startIndex, endIndex);

      if (dataError) throw dataError;
      setData(fetchedData as T[]);
    } catch (err: any) {
      console.error(`Error fetching items from ${tableName}:`, err.message);
      setError(`Could not load items: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [supabase, tableName, currentPage, itemsPerPage, orderBy.column, orderBy.ascending]);

  // --- Real-time Subscription and Initial Fetch ---
  useEffect(() => {
    fetchItems(); // Initial fetch and re-fetch on page/order change

    const channel = supabase
      .channel(`${tableName}_changes_${Math.random().toString(36).substring(7)}`) // Unique channel name
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          console.log(`Real-time change detected in ${tableName}, re-fetching current page:`, payload);
          fetchItems(); // Re-fetch current page on any real-time change
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems, tableName, supabase]); // Dependencies for useEffect

  // --- CRUD Operations ---
  const createItem = async (newItemData: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from(tableName)
        .insert(newItemData)
        .select();

      if (insertError) throw insertError;
      console.log('Item created:', insertedData[0]);
      setCurrentPage(1); // Usually navigate to the first page after creation
      // fetchItems() will be called by the real-time subscription
    } catch (err: any) {
      console.error(`Error creating item in ${tableName}:`, err.message);
      setError(`Could not create item: ${err.message}.`);
      throw err; // Re-throw to allow component to catch specific errors (e.g., validation)
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: number, updatedItemData: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      const { data: updatedData, error: updateError } = await supabase
        .from(tableName)
        .update(updatedItemData)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      console.log('Item updated:', updatedData[0]);
      // fetchItems() will be called by the real-time subscription
    } catch (err: any) {
      console.error(`Error updating item in ${tableName}:`, err.message);
      setError(`Could not update item: ${err.message}.`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      console.log('Item deleted:', id);
      // Adjust page if the last item on the current page was deleted
      if (data.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
      // fetchItems() will be called by the real-time subscription
    } catch (err: any) {
      console.error(`Error deleting item from ${tableName}:`, err.message);
      setError(`Could not delete item: ${err.message}.`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Pagination Controls ---
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalItemsCount,
    createItem,
    updateItem,
    deleteItem,
    goToPage,
    refetch: fetchItems, // Expose refetch function if needed
  };
};

export default useCrud;