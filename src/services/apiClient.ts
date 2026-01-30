import axios from 'axios';
import { SUPABASE_REST_URL, SUPABASE_ANON_KEY } from '../app/utils/api/config';

export const api = axios.create({
  baseURL: SUPABASE_REST_URL,
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
});