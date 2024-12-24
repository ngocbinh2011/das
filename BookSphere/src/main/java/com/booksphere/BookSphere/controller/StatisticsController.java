package com.booksphere.BookSphere.controller;

import com.booksphere.BookSphere.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {
    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/revenue/day")
    public ResponseEntity<Map<LocalDate, Double>> getRevenueByDay() {
        return ResponseEntity.ok(statisticsService.getRevenueByDay());
    }

    @GetMapping("/revenue/month")
    public ResponseEntity<Map<String, Double>> getRevenueByMonth() {
        return ResponseEntity.ok(statisticsService.getRevenueByMonth());
    }
}
