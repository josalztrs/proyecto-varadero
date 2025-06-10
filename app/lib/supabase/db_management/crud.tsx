/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCrud.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
      // Primero, obtenemos el conteo total de elementos con id > 0
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .gt('id', 0); // <--- AÑADIDA CLÁUSULA: id > 0

      if (countError) throw countError;
      setTotalItemsCount(count || 0);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage - 1;

      // Luego, obtenemos los datos paginados, también con id > 0
      const { data: fetchedData, error: dataError } = await supabase
        .from(tableName)
        .select('*')
        .gt('id', 0) // <--- AÑADIDA CLÁUSULA AQUÍ TAMBIÉN
        .order(orderBy.column, { ascending: orderBy.ascending })
        .range(startIndex, endIndex);

      if (dataError) throw dataError;
      setData(fetchedData as T[]);
    } catch (err: any) {
      console.error(`Error fetching items from ${tableName}:`, err.message);
      setError(`Could not load items: ${err.message}. Please try again.`);
      toast.error(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [supabase, tableName, currentPage, itemsPerPage, orderBy.column, orderBy.ascending]);

  const fetchRelatedItemDetails = useCallback(
    async (relatedTableName: string, idColumn: string, value: any) => {
      // No necesitamos aplicar id > 0 aquí, ya que este es para buscar un item específico relacionado,
      // y ese item puede tener cualquier ID válido. La restricción es para los items de la tabla principal.
      if (value === null || value === undefined) return null; // Mejorar la validación de 'value'

      try {
        const { data: relatedData, error: relatedError } = await supabase
          .from(relatedTableName)
          .select('*')
          .eq(idColumn, value)
          .single();

        if (relatedError && relatedError.code !== 'PGRST116') { // PGRST116 es 'No rows found'
          throw relatedError;
        }
        return relatedData;
      } catch (err: any) {
        console.error(`Error fetching related item from ${relatedTableName} where ${idColumn}=${value}:`, err.message);
        toast.error(`Error al buscar detalles relacionados: ${err.message}`);
        return null;
      }
    },
    [supabase]
  );

  useEffect(() => {
    fetchItems();

    // El canal de real-time debe escuchar todos los cambios, no solo id > 0,
    // para que si un item se inserta con id > 0 se refresque, o si se modifica.
    // La lógica de filtrado se aplica en fetchItems.
    const channel = supabase
      .channel(`${tableName}_changes_${Math.random().toString(36).substring(7)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          console.log(`Real-time change detected in ${tableName}, re-fetching current page:`, payload);
          // Re-fetchItems se encargará de aplicar el filtro id > 0
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

  const createItem = async (newItemData: Partial<T>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from(tableName)
        .insert(newItemData)
        .select();

      if (insertError) throw insertError;

      // Asumimos que los IDs generados por la base de datos siempre serán > 0.
      // Si insertas un item con id: 0 manualmente, este filtro lo ignoraría en fetchItems.
      // Si id=0 no es un caso posible para tu tabla, no hay problema.
      console.log('Item created:', insertedData[0]);
      toast.success('Elemento creado exitosamente');

      // Después de crear, refrescamos los datos, comenzando desde la página 1
      // para asegurar que el nuevo elemento (si cumple el filtro id > 0) sea visible.
      setCurrentPage(1);
      await fetchItems();
      return true;
    } catch (err: any) {
      console.error(`Error creating item in ${tableName}:`, err.message);
      setError(`Could not create item: ${err.message}.`);
      toast.error(`Error al crear: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: number, updatedItemData: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      // La actualización se realiza para un ID específico. No aplicamos aquí id > 0,
      // ya que el ID ya se está pasando. Si el ID que pasas es 0, intentará actualizarlo.
      // Asegúrate de que los IDs que manejas en tu UI siempre sean válidos.
      const { data: updatedData, error: updateError } = await supabase
        .from(tableName)
        .update(updatedItemData)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      console.log('Item updated:', updatedData[0]);
      toast.success('Elemento actualizado correctamente');

      await fetchItems();
    } catch (err: any) {
      console.error(`Error updating item in ${tableName}:`, err.message);
      setError(`Could not update item: ${err.message}.`);
      toast.error(`Error al actualizar: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Similar al update, la eliminación se hace por un ID específico.
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      console.log(`Item with ID ${id} deleted successfully.`);
      toast.success('Elemento eliminado correctamente');

      // Si se eliminó el único elemento en la página actual y no es la primera,
      // retrocedemos una página para no mostrar una página vacía.
      if (data.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }

      await fetchItems(); // Refresca los datos
      return true;
    } catch (err: any) {
      console.error(`Error deleting item from ${tableName}:`, err.message);
      setError(`Could not delete item: ${err.message}.`);
      toast.error(`Error al eliminar: ${err.message}`);
      return false;
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
    refetch: fetchItems, // Permite recargar los datos manualmente desde fuera
    fetchRelatedItemDetails,
  };
};

export default useCrud;