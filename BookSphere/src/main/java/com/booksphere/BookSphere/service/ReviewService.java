package com.booksphere.BookSphere.service;

import com.booksphere.BookSphere.dto.ReviewResponseDTO;
import com.booksphere.BookSphere.model.Book;
import com.booksphere.BookSphere.model.Review;
import com.booksphere.BookSphere.model.User;
import com.booksphere.BookSphere.repository.ReviewRepository;
import com.booksphere.BookSphere.request.ReviewRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public ReviewResponseDTO addReview(ReviewRequestDTO reviewRequest) {
        Review review = new Review();
        Book book = new Book();
        book.setId(reviewRequest.getBookId());
        review.setBook(book);

        User user = new User();
        user.setId(reviewRequest.getUserId());
        review.setUser(user);

        review.setComment(reviewRequest.getComment());
        review.setRating(reviewRequest.getRating());

        Review savedReview = reviewRepository.save(review);
        return convertToResponseDTO(savedReview);
    }

    public List<ReviewResponseDTO> getReviewsByBookId(Long bookId) {
        return reviewRepository.findByBookId(bookId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    private ReviewResponseDTO convertToResponseDTO(Review review) {
        ReviewResponseDTO responseDTO = new ReviewResponseDTO();
        responseDTO.setId(review.getId());
        responseDTO.setBookId(review.getBook().getId());
        responseDTO.setUserId(review.getUser().getId());
        responseDTO.setComment(review.getComment());
        responseDTO.setRating(review.getRating());
        return responseDTO;
    }
}
