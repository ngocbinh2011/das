package com.booksphere.BookSphere.controller;

import com.booksphere.BookSphere.model.ShippingAddress;
import com.booksphere.BookSphere.request.ShippingAddressDTO;
import com.booksphere.BookSphere.service.ShippingAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shipping-addresses")
public class ShippingAddressController {
    @Autowired
    private ShippingAddressService shippingAddressService;

    @PostMapping
    public ResponseEntity<ShippingAddress> addShippingAddress(@RequestBody ShippingAddress address) {
        return ResponseEntity.ok(shippingAddressService.addShippingAddress(address));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShippingAddressDTO>> getShippingAddressesByUserId(@PathVariable Long userId) {
        List<ShippingAddress> addresses = shippingAddressService.getShippingAddressesByUserId(userId);
        List<ShippingAddressDTO> addressDTOs = addresses.stream()
            .map(address -> new ShippingAddressDTO(
                address.getId(),
                address.getAddressLine(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry(),
                address.getUser().getId()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(addressDTOs);
    }

    @GetMapping
    public ResponseEntity<List<ShippingAddressDTO>> getAllShippingAddresses() {
        List<ShippingAddress> addresses = shippingAddressService.getAllShippingAddresses();
        List<ShippingAddressDTO> addressDTOs = addresses.stream()
            .map(address -> new ShippingAddressDTO(
                address.getId(),
                address.getAddressLine(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry(),
                address.getUser().getId()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(addressDTOs);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShippingAddress(@PathVariable Long id) {
        shippingAddressService.deleteShippingAddress(id);
        return ResponseEntity.noContent().build();
    }
}
