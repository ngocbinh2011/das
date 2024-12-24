package com.booksphere.BookSphere.service;

import com.booksphere.BookSphere.dto.OrderItemDTO;
import com.booksphere.BookSphere.model.Book;
import com.booksphere.BookSphere.model.Order;
import com.booksphere.BookSphere.model.OrderItem;
import com.booksphere.BookSphere.model.ShippingAddress;
import com.booksphere.BookSphere.model.User;
import com.booksphere.BookSphere.repository.BookRepository;
import com.booksphere.BookSphere.repository.OrderRepository;
import com.booksphere.BookSphere.repository.ShippingAddressRepository;
import com.booksphere.BookSphere.repository.UserRepository;
import com.booksphere.BookSphere.request.OrderRequestDTO;
import com.booksphere.BookSphere.response.OrderResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.commons.mail.Email;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ShippingAddressRepository shippingAddressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    public Order createOrder(OrderRequestDTO orderRequest) {
        Order order = new Order();
        
        // Set user
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);
        
        // Set shipping address
        ShippingAddress shippingAddress = shippingAddressRepository.findById(orderRequest.getShippingAddressId())
                .orElseThrow(() -> new RuntimeException("Shipping address not found"));
        order.setShippingAddress(shippingAddress);
        
        // Set order items
        List<OrderItem> orderItems = orderRequest.getItems().stream().map(itemDTO -> {
            OrderItem orderItem = new OrderItem();
            Book book = bookRepository.findById(itemDTO.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            orderItem.setBook(book);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setOrder(order);
            
            // Decrement stock quantity
            int newStockQuantity = book.getStockQuantity() - itemDTO.getQuantity();
            if (newStockQuantity < 0) {
                throw new RuntimeException("Not enough stock for book: " + book.getTitle());
            }
            book.setStockQuantity(newStockQuantity);
            bookRepository.save(book); // Save the updated book
            
            return orderItem;
        }).collect(Collectors.toList());
        order.setItems(orderItems);
        
        // Set other fields
        order.setStatus(orderRequest.getStatus());
        order.setDescription(orderRequest.getDescription());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setCreatedAt(LocalDateTime.now());
        
        double totalAmount = orderItems.stream()
                .mapToDouble(item -> item.getBook().getPrice() * item.getQuantity())
                .sum();
        order.setTotalAmount(totalAmount);
        
        boolean emailSent = sendOrderConfirmationEmail(user.getEmail(), order);
        
        if (!emailSent) {
            throw new RuntimeException("Failed to send order confirmation email. Order creation aborted.");
        }
        
        Order savedOrder = orderRepository.save(order);
        
        return savedOrder;
    }
    
    private boolean sendOrderConfirmationEmail(String email, Order order) {
        String subject = "Xác nhận đơn hàng";
        String content = "<p>Xin chào,</p>"
                + "<p>Đơn hàng của bạn đã được đặt thành công!</p>"
                + "<p>Thông tin đơn hàng:</p>"
                + "<p>ID đơn hàng: " + order.getId() + "</p>"
                + "<p>Tổng số tiền: " + order.getTotalAmount() + " VNĐ</p>"
                + "<p>Trạng thái: Đặt thành công</p>"
                + "<p>Cảm ơn bạn đã mua hàng!</p>";

        try {
            HtmlEmail htmlEmail = new HtmlEmail();
            htmlEmail.setHostName("");
            htmlEmail.setSmtpPort(0);
            htmlEmail.setStartTLSEnabled(true);
            htmlEmail.setAuthentication("");
            htmlEmail.setFrom("");
            htmlEmail.setSubject(subject);
            htmlEmail.setHtmlMsg(content);
            htmlEmail.addTo(email);
            htmlEmail.setCharset("UTF-8");

            htmlEmail.send();
            System.out.println("Email xác nhận đã được gửi đến " + email);
            return true;
        } catch (EmailException e) {
            System.err.println("Lỗi khi gửi email xác nhận: " + e.getMessage());
            return false;
        }
    }

    private void sendOrderConfirmationEmail(String email, Order order) {
        String subject = "Xác nhận đơn hàng";
        String content = "<p>Xin chào,</p>"
                + "<p>Đơn hàng của bạn đã được đặt thành công!</p>"
                + "<p>Thông tin đơn hàng:</p>"
                + "<p>ID đơn hàng: " + order.getId() + "</p>"
                + "<p>Tổng số tiền: " + order.getTotalAmount() + " VNĐ</p>"
                + "<p>Trạng thái: Đặt thành công</p>"
                + "<p>Cảm ơn bạn đã mua hàng!</p>";

        try {
            HtmlEmail htmlEmail = new HtmlEmail();
            htmlEmail.setHostName("");
            htmlEmail.setSmtpPort(0);
            htmlEmail.setStartTLSEnabled(true);
            htmlEmail.setAuthentication("");
            htmlEmail.setFrom("");
            htmlEmail.setSubject(subject);
            htmlEmail.setHtmlMsg(content);
            htmlEmail.addTo(email);
            htmlEmail.setCharset("UTF-8");

            htmlEmail.send();
            System.out.println("Email xác nhận đã được gửi đến " + email);
        } catch (EmailException e) {
            System.err.println("Lỗi khi gửi email xác nhận: " + e.getMessage());
        }
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private OrderResponseDTO convertToResponseDTO(Order order) {
        OrderResponseDTO responseDTO = new OrderResponseDTO();
        responseDTO.setId(order.getId());
        responseDTO.setUserId(order.getUser().getId());
        responseDTO.setItems(order.getItems().stream().map(this::convertToOrderItemDTO).collect(Collectors.toList()));
        responseDTO.setTotalAmount(order.getTotalAmount());
        responseDTO.setStatus(order.getStatus());
        responseDTO.setDescription(order.getDescription());
        responseDTO.setShippingAddressId(order.getShippingAddress().getId());
        responseDTO.setPaymentMethod(order.getPaymentMethod());
        responseDTO.setCreatedAt(order.getCreatedAt());
        return responseDTO;
    }

    private OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setBookId(orderItem.getBook().getId());
        itemDTO.setQuantity(orderItem.getQuantity());
        return itemDTO;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public void cancelOrder(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            Order existingOrder = order.get();
            existingOrder.setStatus("rejected"); 
            orderRepository.save(existingOrder); 
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }

    public List<Book> getBooksByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .flatMap(order -> order.getItems().stream()
                        .map(OrderItem::getBook))
                .distinct() // To avoid duplicates
                .collect(Collectors.toList());
    }
}
