
import { supabase } from "@/integrations/supabase/client";

export const checkOtherDbStructure = async () => {
  const { data, error } = await supabase.functions.invoke('check-other-db');
  
  if (error) {
    console.error('Error checking other DB:', error);
    throw error;
  }
  
  return data;
};

if (typeof window !== 'undefined') {
  (window as any).checkOtherDbStructure = checkOtherDbStructure;
}
