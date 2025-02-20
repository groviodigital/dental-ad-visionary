
import { supabase } from "@/integrations/supabase/client";

export const crossDbOperation = async (operation: string, table: string, data?: any) => {
  const { data: result, error } = await supabase.functions.invoke('cross-db-operations', {
    body: { operation, table, data }
  });
  
  if (error) {
    console.error('Error in cross DB operation:', error);
    throw error;
  }
  
  return result;
};

if (typeof window !== 'undefined') {
  (window as any).crossDbOperation = crossDbOperation;
}
