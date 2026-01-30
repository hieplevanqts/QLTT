import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** UI Review model */
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

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    /** 👇 SAGA sẽ nghe action này */
    fetchReviewsRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchReviewsSuccess: (state, action: PayloadAction<Review[]>) => {
      state.isLoading = false;
      state.reviews = action.payload;
    },

    fetchReviewsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearReviews: (state) => {
      state.reviews = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  clearReviews,
} = reviewSlice.actions;

export default reviewSlice.reducer;
