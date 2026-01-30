import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchReviewsForMerchant, ApiReview } from '../../services/reviewsApi';
import {
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  Review,
} from '@/store/slices/reviewSlice';

/** Map API → UI model */
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

/** Worker saga */
function* fetchReviewsWorker(action: ReturnType<typeof fetchReviewsRequest>) {
  try {
    const merchantId = action.payload;

    const apiReviews: ApiReview[] = yield call(fetchReviewsForMerchant, merchantId);

    // sort rating desc, then newest
    const sorted = apiReviews.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const mapped: Review[] = sorted.map(mapApiReviewToState);

    yield put(fetchReviewsSuccess(mapped));
  } catch (err: any) {
    yield put(
      fetchReviewsFailure(err?.message || 'Không thể tải danh sách đánh giá')
    );
  }
}

/** Watcher saga */
export function* reviewsSaga() {
  yield takeLatest(fetchReviewsRequest.type, fetchReviewsWorker);
}
