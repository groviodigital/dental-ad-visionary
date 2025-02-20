
import { supabase } from "@/integrations/supabase/client";

export const checkOtherDbStructure = async () => {
  const { data, error } = await supabase.functions.invoke('check-other-db', {
    body: {} // Adding empty body to ensure proper function call
  });
  
  if (error) {
    console.error('Error checking other DB:', error);
    throw error;
  }
  
  return data;
};

// Initialize window function immediately
if (typeof window !== 'undefined') {
  (window as any).checkOtherDbStructure = checkOtherDbStructure;
}

// Export for importing in other files
export default checkOtherDbStructure;
