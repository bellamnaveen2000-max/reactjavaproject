# Enterprise Java Microservices + React

A Java 21/Spring Boot product and cart system with a React 18+ console. Product
and cart are separate services with separate databases; cart calls product over
WebClient and publishes cart events to Kafka for product-service consumption.

## Requirements

- Java 21
- Maven 3.9+
- Node.js 20+ and npm
- Docker Desktop for the local Kafka broker (SQL Server is optional)

## Start the backend

From the repository root, start Kafka (the product consumer listens to the
`cart.item.added` topic):

```powershell
docker compose up -d kafka
```

In separate terminals, start the services with their default in-memory H2
databases:

```powershell
mvn -pl product-service spring-boot:run
mvn -pl cart-service spring-boot:run
```

- Product service: `http://localhost:8081`
- Cart service: `http://localhost:8082`
- Kafka: `localhost:19092` by default (override host port with `KAFKA_PORT`)

The default H2 stores are in memory and reset when their service process stops.
JPA creates/updates the tables at startup.

## API

### Products

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `POST` | `/api/products` | Create `{ "name": "Desk", "price": 49.99, "stock": 8 }` |
| `GET` | `/api/products?page=0&size=20&sortBy=name&direction=asc` | Paged/sorted catalog |
| `GET` | `/api/products/{id}` | Product details |
| `PUT` | `/api/products/{id}` | Replace product name, price, and stock |
| `DELETE` | `/api/products/{id}` | Delete a product |
| `GET` | `/api/products/search?name=desk&maxPrice=100` | Case-insensitive Java Streams filtering |
| `GET` | `/api/products/above-price?minPrice=20` | Parameterized native SQL query |

Product names must be nonblank; prices must be positive; stock cannot be
negative. Page size is limited to 100 and sort fields are allow-listed.

### Cart

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `POST` | `/api/cart/users/{userId}/items` | Add `{ "productId": 1, "quantity": 2 }` |
| `GET` | `/api/cart/users/{userId}` | Read cart lines and total |
| `DELETE` | `/api/cart/users/{userId}/items/{productId}` | Remove a line |

Cart add looks up the product with WebClient and rejects missing products or a
quantity above current stock before persisting. It publishes a JSON
`cart.item.added` event containing `cartId`, `productId`, and requested
`quantity`. The product service consumes and logs those events. Kafka connection
and topic settings can be overridden with `KAFKA_BOOTSTRAP_SERVERS` and
`KAFKA_CART_EVENTS_TOPIC`.

## React application

```powershell
cd frontend
npm install
npm test
npm run build
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). The catalog supports
search, price filtering, backend pagination, and add-to-cart. The add-product
screen creates products and the cart screen displays/removes cart lines. API
requests live in Axios service modules and are dispatched through Redux Toolkit
thunks. Configure alternate backend URLs with `VITE_PRODUCT_API_URL` and
`VITE_CART_API_URL`; copy `frontend/.env.example` to `frontend/.env`.

The Kafka host port defaults to `19092` to avoid collisions with a local broker.
Set `KAFKA_PORT` before `docker compose up -d kafka` to choose another available
port, and set `KAFKA_BOOTSTRAP_SERVERS` to the matching host/port for both
services.

## SQL Server

Copy `.env.example` to `.env` and replace all placeholder passwords with strong
local credentials. Start the optional SQL Server container with a PowerShell
environment variable set:

```powershell
$env:MSSQL_SA_PASSWORD = "Use-A-Strong-Local-Password!123"
docker compose -f compose.yaml -f compose.sqlserver.yaml --profile sqlserver up -d sqlserver
```

The optional SQL Server container publishes on port `11433` by default because
port `1433` may already be used by a local SQL Server installation. Override
`SQLSERVER_PORT` if needed. Create `ProductDb` and `CartDb` before connecting
(JPA creates tables inside existing databases, not the databases themselves).
Configure service-specific environment variables, then activate the profile:

```powershell
$env:PRODUCT_DB_URL = "jdbc:sqlserver://localhost:11433;databaseName=ProductDb;encrypt=true;trustServerCertificate=true"
$env:PRODUCT_DB_USERNAME = "sa"
$env:PRODUCT_DB_PASSWORD = $env:MSSQL_SA_PASSWORD
$env:CART_DB_URL = "jdbc:sqlserver://localhost:11433;databaseName=CartDb;encrypt=true;trustServerCertificate=true"
$env:CART_DB_USERNAME = "sa"
$env:CART_DB_PASSWORD = $env:MSSQL_SA_PASSWORD
mvn -pl product-service spring-boot:run "-Dspring-boot.run.profiles=sqlserver"
mvn -pl cart-service spring-boot:run "-Dspring-boot.run.profiles=sqlserver"
```

Do not commit `.env` or real credentials.

## Validation

Run backend tests from the root with `mvn clean verify`. Run frontend tests and
the production build from `frontend` with `npm test` and `npm run build`.
