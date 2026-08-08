package com.omoikaneinnovation.hrmsbackend.service;

import com.omoikaneinnovation.hrmsbackend.config.RazorpayConfig;
import com.razorpay.RazorpayClient;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    public RazorpayService(RazorpayConfig config) throws Exception {
        this.razorpayClient =
                new RazorpayClient(config.getKeyId(), config.getKeySecret());
    }


    public Order createOrder(int amount) throws Exception {

        JSONObject orderRequest = new JSONObject();

        orderRequest.put("amount", amount);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

        return razorpayClient.orders.create(orderRequest);
    }
    
    public RazorpayClient getClient() {
        return razorpayClient;
    }
}