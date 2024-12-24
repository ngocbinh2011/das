package com.booksphere.BookSphere.controller;

import com.booksphere.BookSphere.model.ProductCategory;
import com.booksphere.BookSphere.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class ProductCategoryController {
    @Autowired
    private ProductCategoryService service;

    @PostMapping
    public ResponseEntity<ProductCategory> addCategory(@RequestBody ProductCategory category) {
        return ResponseEntity.ok(service.addCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> updateCategory(@PathVariable Long id, @RequestBody ProductCategory category) {
        return ResponseEntity.ok(service.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductCategory> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCategoryById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductCategory>> searchCategories(@RequestParam String name) {
        return ResponseEntity.ok(service.searchCategoriesByName(name));
    }
}
