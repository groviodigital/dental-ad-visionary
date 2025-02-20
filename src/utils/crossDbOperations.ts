
import { supabase } from "@/integrations/supabase/client";

export const crossDbOperation = async (operation: string, table: string, data?: any) => {
  try {
    switch (operation.toLowerCase()) {
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
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data.updates)
          .eq('id', data.id)
          .select();
        if (updateError) throw updateError;
        return updateData;
        
      case 'delete':
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
