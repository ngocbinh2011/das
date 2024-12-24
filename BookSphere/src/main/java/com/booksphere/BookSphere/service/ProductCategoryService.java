package com.booksphere.BookSphere.service;

import com.booksphere.BookSphere.model.ProductCategory;
import com.booksphere.BookSphere.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;

    @Autowired
    public ProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    public ProductCategory addCategory(ProductCategory category) {
        return productCategoryRepository.save(category);
    }

    public ProductCategory updateCategory(Long id, ProductCategory category) {
        if (!productCategoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        category.setId(id);
        return productCategoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        if (!productCategoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        productCategoryRepository.deleteById(id);
    }

    public ProductCategory getCategoryById(Long id) {
        return productCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAll();
    }

    public List<ProductCategory> searchCategoriesByName(String name) {
        return productCategoryRepository.findByNameContaining(name);
    }
}
