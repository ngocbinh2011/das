package com.booksphere.BookSphere.repository;

import com.booksphere.BookSphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByUsernameContaining(String username);
    User findByEmail(String email);
}
