package com.booksphere.BookSphere.repository;

import com.booksphere.BookSphere.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByPromotionNameContaining(String name);
}
