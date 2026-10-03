# Microservices Exercise

This Maven multi-module project contains two Spring Boot services:

- `product-service` runs on port 8081.
- `cart-service` runs on port 8082.

Both services include Spring Web, Spring Data JPA, the Microsoft SQL Server JDBC
driver, and Lombok. They use an in-memory H2 database by default so they can
start locally before SQL Server credentials are configured.

## Run locally

From this directory, run each service in a separate terminal:

```powershell
mvn -pl product-service spring-boot:run
mvn -pl cart-service spring-boot:run
```

## Use SQL Server

Set the relevant connection environment variables, then activate the `sqlserver`
profile:

```powershell
$env:PRODUCT_DB_URL = "jdbc:sqlserver://localhost:1433;databaseName=ProductDb;encrypt=true;trustServerCertificate=true"
$env:PRODUCT_DB_USERNAME = "your-user"
$env:PRODUCT_DB_PASSWORD = "your-password"
mvn -pl product-service spring-boot:run "-Dspring-boot.run.profiles=sqlserver"
```

For the cart service, use `CART_DB_URL`, `CART_DB_USERNAME`, and
`CART_DB_PASSWORD`, then run:

```powershell
mvn -pl cart-service spring-boot:run "-Dspring-boot.run.profiles=sqlserver"
```
