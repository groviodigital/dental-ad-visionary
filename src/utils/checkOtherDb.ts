
import { supabase } from "@/integrations/supabase/client";

export const checkOtherDbStructure = async () => {
  try {
    // Get all tables in the public schema
    const { data: tables, error } = await supabase
      .from('dental_practices')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error checking database:', error);
      throw error;
    }
    
    return tables;
  } catch (error) {
    console.error('Error checking database structure:', error);
    throw error;
  }
};

// Initialize window function immediately
if (typeof window !== 'undefined') {
  (window as any).checkOtherDbStructure = checkOtherDbStructure;
}

export default checkOtherDbStructure;
