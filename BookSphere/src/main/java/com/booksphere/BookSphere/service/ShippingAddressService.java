package com.booksphere.BookSphere.service;

import com.booksphere.BookSphere.exception.ShippingAddressException;
import com.booksphere.BookSphere.model.Order;
import com.booksphere.BookSphere.model.ShippingAddress;
import com.booksphere.BookSphere.repository.OrderRepository;
import com.booksphere.BookSphere.repository.ShippingAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShippingAddressService {
    @Autowired
    private ShippingAddressRepository shippingAddressRepository;

    @Autowired
    private OrderRepository orderRepository;

    public ShippingAddress addShippingAddress(ShippingAddress address) {
        return shippingAddressRepository.save(address);
    }

    public List<ShippingAddress> getShippingAddressesByUserId(Long userId) {
        return shippingAddressRepository.findByUserId(userId);
    }

    public void deleteShippingAddress(Long id) {
        List<Order> orders = orderRepository.findByShippingAddressId(id);
        if (!orders.isEmpty()) {
            throw new ShippingAddressException("Cannot delete shipping address as it is referenced by existing orders.");
        }
        shippingAddressRepository.deleteById(id);
    }

    public List<ShippingAddress> getAllShippingAddresses() {
        return shippingAddressRepository.findAll();
    }
}
