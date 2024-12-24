package com.booksphere.BookSphere;

import com.booksphere.BookSphere.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Swagger configuration is set up in SwaggerConfig class
@SpringBootApplication
public class BookSphereApplication implements CommandLineRunner {

	@Autowired
	private AuthService authService;

	public static void main(String[] args) {
		SpringApplication.run(BookSphereApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		authService.createDefaultAdmin(); // Tạo tài khoản admin khi ứng dụng khởi động
	}

}
