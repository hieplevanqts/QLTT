import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchReviewsForMerchant, ApiReview } from '../../services/reviewsApi';

// Định nghĩa kiểu dữ liệu Review được sử dụng trong UI
export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  helpful: number;
  replies: number;
}

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  isLoading: false,
  error: null,
};

// Hàm chuyển đổi dữ liệu từ API sang dạng mà UI cần
const mapApiReviewToState = (apiReview: ApiReview): Review => ({
  id: apiReview.id,
  userName: apiReview.user_name,
  userAvatar: apiReview.user_avatar,
  rating: apiReview.rating,
  date: new Date(apiReview.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
  comment: apiReview.comment,
  images: apiReview.images,
  helpful: apiReview.helpful_count,
  replies: apiReview.reply_count,
});

// Thunk để gọi API bất đồng bộ
export const fetchReviewsRequest = createAsyncThunk(
  'reviews/fetchReviews',
  async (merchantId: string, { rejectWithValue }) => {
    try {
      const apiReviews = await fetchReviewsForMerchant(merchantId);
      // Sắp xếp theo rating giảm dần, sau đó theo ngày tạo mới nhất
      const sortedApiReviews = apiReviews.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      return sortedApiReviews.map(mapApiReviewToState);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải danh sách đánh giá');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewsRequest.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;