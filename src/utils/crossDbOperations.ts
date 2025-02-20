
import { supabase } from "@/integrations/supabase/client";

export const crossDbOperation = async (
  operation: 'select' | 'insert' | 'update' | 'delete',
  table: string,
  data?: any
) => {
  const { data: result, error } = await supabase.functions.invoke('cross-db-operations', {
    body: {
      operation,
      table,
      data,
    },
  });

  if (error) throw error;
  return result;
};
