import { api } from './apiClient';

export interface ApiReview {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  created_at: string; // ISO date string
  comment: string;
  images?: string[];
  helpful_count: number;
  reply_count: number;
  merchant_id: string;
}

export const fetchReviewsForMerchant = async (merchantId: string): Promise<ApiReview[]> => {
  try {
    const response = await api.get<ApiReview[]>('/reviews', {
      params: { merchant_id: `eq.${merchantId}`, select: '*' },
    });
    return response.data;
  } catch (error) {
    console.error(`[API] Failed to fetch reviews for merchant ${merchantId}:`, error);
    throw error;
  }
};