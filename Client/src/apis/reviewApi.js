import axiosClient from "./axiosClient";

const API_URL = '/reviews';

const reviewApi = {
  createReview(data) {
    return axiosClient.post(API_URL, data);
  },
  
  getReviewsByBookId(bookId) {
    return axiosClient.get(`${API_URL}/book/${bookId}`);
  },
  
  deleteReview(id) {
    return axiosClient.delete(`${API_URL}/${id}`);
  }
};

export default reviewApi;
