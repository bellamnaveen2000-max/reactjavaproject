package com.example.cart;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CartServiceApplicationTests {

    @LocalServerPort
    private int port;

    @Test
    void applicationStartsOnAnAvailablePort() {
        assertThat(port).isPositive();
    }
}
