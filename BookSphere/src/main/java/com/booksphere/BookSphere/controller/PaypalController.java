package com.booksphere.BookSphere.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
public class PaypalController {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;

    public PaypalController() {
        this.restTemplate = new RestTemplate();
    }

    @PostMapping("/payment")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> paymentDetails) {
        try {
            String accessToken = getAccessToken();

            // Prepare request body for creating payment
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("intent", "sale");
            requestBody.put("payer", Map.of("payment_method", "paypal"));
            requestBody.put("transactions", new Object[]{
                    Map.of(
                            "amount", Map.of(
                                    "currency", "USD",
                                    "total", paymentDetails.get("price")
                            ),
                            "description", paymentDetails.get("description")
                    )
            });
            requestBody.put("redirect_urls", Map.of(
                    "return_url", paymentDetails.get("return_url"),
                    "cancel_url", paymentDetails.get("cancel_url")
            ));

            // Send request to create payment
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://api.sandbox.paypal.com/v1/payments/payment",
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            // Extract approval URL from response
            List<Map<String, Object>> links = (List<Map<String, Object>>) response.getBody().get("links");
            String approvalUrl = links.stream()
                    .filter(link -> link.get("rel").equals("approval_url"))
                    .map(link -> (String) link.get("href"))
                    .findFirst()
                    .orElse(null);

            return ResponseEntity.ok(Map.of("approvalUrl", approvalUrl, "accessToken", accessToken));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @GetMapping("/execute")
    public ResponseEntity<?> executePayment(@RequestParam String paymentId, @RequestParam String token, @RequestParam String PayerID) {
        try {
            String accessToken = getAccessToken();

            // Prepare request body for executing payment
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("payer_id", PayerID);

            // Send request to execute payment
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://api.sandbox.paypal.com/v1/payments/payment/" + paymentId + "/execute",
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            // Check payment state
            String state = (String) response.getBody().get("state");
            if ("approved".equals(state)) {
                return ResponseEntity.ok(Map.of("message", "Payment successful"));
            } else {
                return ResponseEntity.ok(Map.of("message", "Payment failed"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    private String getAccessToken() {
        // Prepare request body for getting access token
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "client_credentials");

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");
        headers.set("Authorization", "Basic " + Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes()));

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.sandbox.paypal.com/v1/oauth2/token",
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        return (String) response.getBody().get("access_token");
    }
} 