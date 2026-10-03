package com.example.product.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class CartEventListener {

    private static final Logger log = LoggerFactory.getLogger(CartEventListener.class);

    @KafkaListener(topics = "${app.kafka.topic.cart-events}")
    public void onCartItemAdded(String eventJson) {
        log.info("Received cart item event: {}", eventJson);
    }
}
