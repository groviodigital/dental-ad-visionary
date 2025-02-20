
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];
type DentalPractice = Tables['dental_practices']['Row'];

export const crossDbOperation = async (
  operation: 'select' | 'insert' | 'update' | 'delete',
  table: 'dental_practices',
  data?: Partial<DentalPractice> | { updates: Partial<DentalPractice>; id: string }
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
        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert(data)
          .select();
        if (insertError) throw insertError;
        return insertData;
        
      case 'update':
        if (!data || !('updates' in data) || !('id' in data)) {
          throw new Error('Invalid update data format');
        }
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data.updates)
          .eq('id', data.id)
          .select();
        if (updateError) throw updateError;
        return updateData;
        
      case 'delete':
        if (typeof data !== 'string') {
          throw new Error('Delete operation requires an ID string');
        }
        const { data: deleteData, error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', data)
          .select();
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
