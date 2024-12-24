package com.booksphere.BookSphere.util;

import com.booksphere.BookSphere.model.User;
import com.booksphere.BookSphere.repository.UserRepository;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class UserDeserializer extends JsonDeserializer<User> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        Long userId = p.getLongValue();
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
