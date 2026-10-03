package com.example.cart.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class CartEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(CartEventPublisher.class);
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topic;

    public CartEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper,
                              @Value("${app.kafka.topic.cart-events}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topic = topic;
    }

    public void publish(CartResponseEvent event) {
        final String payload;
        try {
            payload = objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Could not serialize cart event", exception);
        }
        kafkaTemplate.send(topic, event.productId().toString(), payload).whenComplete((result, failure) -> {
            if (failure != null) {
                log.error("Failed to publish cart item event for cart {}", event.cartId(), failure);
                return;
            }
            log.info("Published cart item event for cart {} to topic {}", event.cartId(), topic);
        });
    }

    public record CartResponseEvent(Long cartId, Long productId, int quantity) {
    }
}
