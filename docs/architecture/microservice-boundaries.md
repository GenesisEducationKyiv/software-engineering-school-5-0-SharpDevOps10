# Define and Document Clear Boundaries Between Modules / Microservices

To ensure proper modularity, scalability, and team autonomy, the system defines clear functional and technical
boundaries between microservices. Each service owns its own domain logic, database, and external dependencies.
Communication between services is done only via well-defined public APIs (e.g., gRPC), with no shared persistence or
hidden coupling.

## Microservice Boundaries

### **Weather Service**

* **Owned Domain**: Fetching and caching current weather from third-party providers.
* **Exposed API**: `GetCurrentWeather(CityRequest)` via gRPC.
* **Dependencies**:
    * Third-party weather APIs (WeatherAPI.com, Visual Crossing).
    * Redis for caching.

### **Subscription Service**

* **Owned Domain**: Managing subscriptions, token confirmation, subscription cancellation, and PostgreSQL persistence.
* **Exposed API**:
    * `Subscribe(CreateSubscriptionRequest)`,
    * `Confirm(TokenRequest)`,
    * `Unsubscribe(TokenRequest)` via gRPC.
* **Dependencies**:
    * PostgreSQL for subscription data.
    * Prisma ORM for database access.

### **Notification Service**

* **Owned Domain**: Sending scheduled email notifications based on user subscriptions.
* **Exposed API**: -.
* **Dependencies**:
    * Cron jobs for scheduling.
    * Calls Subscription, Weather, Email services.

### **Email Service**

* **Owned Domain**: Sending emails, managing templates, and handling retries.
* **Exposed API**:
    * `SendConfirmationEmail(SendConfirmationEmailRequest)`,
    * `SendWeatherUpdateEmail(SendWeatherUpdateEmailRequest)` via gRPC.
* **Dependencies**:
    * Nodemailer for email delivery.

### API Gateway

* **Owned Domain**: Public-facing REST API, authentication, and request routing.
* **Exposed API**: REST endpoints:
    * `POST /subscribe`
    * `POST /confirm`
    * `POST /unsubscribe`
    * `GET /weather`
* **Dependencies**:
    * Routes requests to internal gRPC services.

## Boundary Rules

* Each service owns its own database/cache — no shared access.
* Services communicate only through public APIs (gRPC).
* No cross-service imports beyond shared libraries.