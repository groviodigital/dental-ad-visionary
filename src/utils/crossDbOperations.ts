
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DentalPractice = Database['public']['Tables']['dental_practices'];

// These types ensure we maintain the required fields from Supabase
type InsertData = DentalPractice['Insert'];
type UpdateData = DentalPractice['Update'];

export const crossDbOperation = async (
  operation: 'select' | 'insert' | 'update' | 'delete',
  table: 'dental_practices',
  data?: InsertData | { updates: UpdateData; id: string } | string
) => {
  try {
    switch (operation) {
      case 'select':
        const { data: selectData, error: selectError } = await supabase
          .from(table)
          .select('*');
        if (selectError) throw selectError;
        return selectData;

      case 'insert':
        if (!data || typeof data === 'string' || 'updates' in data) {
          throw new Error('Invalid insert data format');
        }
        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert(data);
        if (insertError) throw insertError;
        return insertData;

      case 'update':
        if (!data || typeof data === 'string' || !('updates' in data)) {
          throw new Error('Invalid update data format');
        }
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data.updates)
          .eq('id', data.id);
        if (updateError) throw updateError;
        return updateData;

      case 'delete':
        if (typeof data !== 'string') {
          throw new Error('Delete operation requires an ID string');
        }
        const { data: deleteData, error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', data);
        if (deleteError) throw deleteError;
        return deleteData;

      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  } catch (error) {
    console.error('Error in database operation:', error);
    throw error;
  }
};

// Initialize window function immediately
if (typeof window !== 'undefined') {
  (window as any).crossDbOperation = crossDbOperation;
}

export default crossDbOperation;
