package com.omoikaneinnovation.hrmsbackend.controller;

import com.omoikaneinnovation.hrmsbackend.service.RazorpayService;
import com.razorpay.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.razorpay.RazorpayClient;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @PostMapping("/create-order")
    public String createOrder() throws Exception {

        // Amount is in paise (50000 = ₹500)
        Order order = razorpayService.createOrder(50000);

        return order.toString();
    }
}