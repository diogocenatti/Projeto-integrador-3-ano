import { supabase } from '../lib/supabase';

export async function fetchPortugalContent(section = null) {
  let query = supabase.from('portugal_content').select('*');

  if (section) {
    query = query.eq('section', section);
  }

  const { data, error } = await query.order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchPortugalSection(section) {
  return fetchPortugalContent(section);
}
