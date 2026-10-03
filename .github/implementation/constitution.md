# Project Constitution

1. Preserve the Java 21, Spring Boot, and React 18+ stack required by the exercise.
2. Keep strict layers: controllers handle HTTP, services own business rules, repositories own persistence, and frontend components render UI while Redux thunks and API services own data access.
3. Never use `RestTemplate`; service-to-service HTTP uses Spring `WebClient`.
4. Never commit credentials. Local H2 is the default; SQL Server and Kafka connection details are environment-configurable.
5. Validate inputs at HTTP boundaries, return consistent error responses, and log API failures and Kafka events without logging secrets.
6. Each exercise phase must compile and pass its relevant tests before it is committed. Do not claim a remote push unless the remote accepts it.
