# Implementation Architecture

## Backend

Two independent Spring Boot modules share the Maven parent and Java 21 toolchain. Each service has controller → service → Spring Data repository → JPA entity layers, DTOs for HTTP, Jakarta validation, and a global exception handler. H2 remains the default local database; existing `sqlserver` profiles point to SQL Server using environment variables.

Product API:

- `POST /api/products` — create product.
- `GET /api/products` — paged/sorted product response.
- `GET /api/products/{id}` — product detail, including current stock.
- `PUT /api/products/{id}` — update.
- `DELETE /api/products/{id}` — delete.
- `GET /api/products/search?name=&maxPrice=` — service-side Java Streams filter.
- `GET /api/products/above-price?minPrice=` — repository native query.

Cart API:

- `POST /api/cart/users/{userId}/items` — validate product and stock, persist cart item, publish `cart.item.added`.
- `GET /api/cart/users/{userId}` — retrieve cart and item totals/details.
- `DELETE /api/cart/users/{userId}/items/{productId}` — remove cart item.

Cart uses a configured `WebClient` to call the product API. Product lookup is represented as a `CompletableFuture`; quantity/stock validation runs in its continuation before persistence. Kafka producer and consumer use the same configurable topic. H2 and Kafka may be overridden by environment/profile configuration.

## Frontend

Vite/React application uses Redux Toolkit slices and async thunks, Axios service modules, React Router routes, custom hooks, and presentational components. Product pagination/search/filter state is separated from UI rendering. The frontend API base URL is configurable.

## Local runtime

Maven builds backend modules; npm builds/tests the UI. Docker Compose provides SQL Server/Kafka only when explicitly needed; H2 keeps basic development and tests self-contained.
