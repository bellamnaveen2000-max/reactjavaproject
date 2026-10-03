# Enterprise Java Microservices and React UI Requirements

Source: user-provided Enterprise Java Microservices Exercise and React 18 + Redux exercise.

## Backend

- **REQ-BE-01**: Product service on port 8081 exposes create, read, update, delete, and list APIs backed by a JPA entity and repository.
- **REQ-BE-02**: Product listing supports page, size, and sort field.
- **REQ-BE-03**: Product service demonstrates Java Streams filtering/transformation and a parameterized native query for products above a price.
- **REQ-BE-04**: Cart service on port 8082 persists carts and cart items with userId, productId, and quantity.
- **REQ-BE-05**: Cart service calls product service through WebClient, verifies product existence and stock, and never uses RestTemplate.
- **REQ-BE-06**: Cart add flow publishes a Kafka event; product service consumes and logs it.
- **REQ-BE-07**: Cart processing uses CompletableFuture for asynchronous product retrieval/validation.
- **REQ-BE-08**: Request validation rejects null/non-positive quantities and invalid product data; global exception handling returns useful HTTP errors.
- **REQ-BE-09**: API operations, errors, and Kafka events are logged.
- **REQ-BE-10**: H2 supports local development; SQL Server is supported by the existing SQL Server profiles.

## Frontend

- **REQ-FE-01**: Vite React 18+ application uses functional components and hooks only.
- **REQ-FE-02**: Redux Toolkit store/slices and createAsyncThunk own product/cart state; components do not call APIs directly.
- **REQ-FE-03**: Axios API services integrate product list/create and cart operations.
- **REQ-FE-04**: Product list/create and cart pages are provided with React Router v6+ routes `/products`, `/add-product`, `/cart`.
- **REQ-FE-05**: Product UI presents loading/errors, name/price filters using useMemo, and backend pagination.
- **REQ-FE-06**: Users can add products to cart and view cart items.
- **REQ-FE-07**: UI and API service concerns follow the specified app/features/pages/components/services/hooks/routes/utils structure.

## Delivery

- **REQ-DEL-01**: Each coherent exercise phase is committed separately after relevant checks pass.
- **REQ-DEL-02**: README describes setup, configuration, APIs, and how to run backend/frontend/integrations locally.
- **REQ-DEL-03**: Push completed commits to the configured Git remote when available.
