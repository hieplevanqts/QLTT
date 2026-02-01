import axios from 'axios';
import { SUPABASE_REST_URL, apiKey } from '../utils/api/config';

export const api = axios.create({
  baseURL: SUPABASE_REST_URL,
  headers: {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});