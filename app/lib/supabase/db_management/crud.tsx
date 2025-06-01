// hooks/useCrud.ts
import { useState, useEffect, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

interface CrudItem {
  id: number;
  [key: string]: any;
}

interface UseCrudOptions {
  itemsPerPage?: number;
  orderBy?: { column: string; ascending: boolean };
}

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

  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalItemsCount(count || 0);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage - 1;

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

  // --- NEW: Function to fetch details for a single related item ---
  const fetchRelatedItemDetails = useCallback(
    async (relatedTableName: string, id: number) => {
      if (!id) return null; // Handle cases where ID might be null/undefined

      try {
        const { data: relatedData, error: relatedError } = await supabase
          .from(relatedTableName)
          .select('*')
          .eq('id', id)
          .single(); // Use .single() to get one record

        if (relatedError && relatedError.code !== 'PGRST116') { // PGRST116 is "no rows found"
          throw relatedError;
        }
        return relatedData;
      } catch (err: any) {
        console.error(`Error fetching related item from ${relatedTableName} with ID ${id}:`, err.message);
        return null;
      }
    },
    [supabase]
  );


  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel(`${tableName}_changes_${Math.random().toString(36).substring(7)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          console.log(`Real-time change detected in ${tableName}, re-fetching current page:`, payload);
          fetchItems();
        }
      )
      .subscribe((status) => {
        console.log(`[useCrud - ${tableName}] Channel status: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems, tableName, supabase]);

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
      setCurrentPage(1);
    } catch (err: any) {
      console.error(`Error creating item in ${tableName}:`, err.message);
      setError(`Could not create item: ${err.message}.`);
      throw err;
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
      if (data.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err: any) {
      console.error(`Error deleting item from ${tableName}:`, err.message);
      setError(`Could not delete item: ${err.message}.`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
    refetch: fetchItems,
    fetchRelatedItemDetails, // Expose the new function
  };
};

export default useCrud;