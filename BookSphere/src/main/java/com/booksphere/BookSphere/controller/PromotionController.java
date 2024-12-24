package com.booksphere.BookSphere.controller;

import com.booksphere.BookSphere.model.Promotion;
import com.booksphere.BookSphere.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {
    @Autowired
    private PromotionService service;

    @PostMapping
    public ResponseEntity<Promotion> addPromotion(@RequestBody Promotion promotion) {
        return ResponseEntity.ok(service.addPromotion(promotion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotion) {
        return ResponseEntity.ok(service.updatePromotion(id, promotion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        service.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPromotionById(id));
    }

    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(service.getAllPromotions());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Promotion>> searchPromotions(@RequestParam String name) {
        return ResponseEntity.ok(service.searchPromotionsByName(name));
    }
}
