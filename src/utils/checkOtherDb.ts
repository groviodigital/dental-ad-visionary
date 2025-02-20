
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DentalPractice = Database['public']['Tables']['dental_practices']['Row'];

export const checkOtherDbStructure = async (): Promise<DentalPractice[]> => {
  try {
    const { data: practices, error } = await supabase
      .from('dental_practices')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error checking database:', error);
      throw error;
    }
    
    return practices || [];
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
