
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

export const crossDbOperation = async <T extends TableName>(
  operation: 'select' | 'insert' | 'update' | 'delete',
  table: T,
  data?: any
) => {
  try {
    switch (operation) {
      case 'select':
        const { data: selectData, error: selectError } = await supabase
          .from(table)
          .select('*');
        if (selectError) throw selectError;
        return selectData as TableRow<T>[];
        
      case 'insert':
        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert(data as TableInsert<T>)
          .select();
        if (insertError) throw insertError;
        return insertData as TableRow<T>[];
        
      case 'update':
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data.updates as TableUpdate<T>)
          .eq('id', data.id)
          .select();
        if (updateError) throw updateError;
        return updateData as TableRow<T>[];
        
      case 'delete':
        const { data: deleteData, error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', data)
          .select();
        if (deleteError) throw deleteError;
        return deleteData as TableRow<T>[];
        
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
