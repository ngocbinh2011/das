package com.booksphere.BookSphere.service;

import com.booksphere.BookSphere.model.Promotion;
import com.booksphere.BookSphere.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository repository;

    public Promotion addPromotion(Promotion promotion) {
        return repository.save(promotion);
    }

    public Promotion updatePromotion(Long id, Promotion promotion) {
        promotion.setPromotionId(id);
        return repository.save(promotion);
    }

    public void deletePromotion(Long id) {
        repository.deleteById(id);
    }

    public Promotion getPromotionById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Promotion> getAllPromotions() {
        return repository.findAll();
    }

    public List<Promotion> searchPromotionsByName(String name) {
        return repository.findByPromotionNameContaining(name);
    }
}
