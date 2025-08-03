# Subscription Service

A microservice that manages weather notification subscriptions. Built with NestJS and PostgreSQL, it handles
the subscription lifecycle, confirmation flows, and integration with email and weather services.

## Features

- Subscription management
    - Create new subscriptions
    - Confirm subscriptions via email tokens
    - Unsubscribe functionality
- Email notifications via gRPC
- PostgreSQL database integration
- Token-based confirmation system
- TypeScript support
- Comprehensive testing setup
- Database migrations
- Prisma ORM integration

## Prerequisites

- Node.js
- npm package manager
- PostgreSQL database
- Running instances of:
    - Email Service
    - Weather Service

## Installation

```bash
$ npm install
```

## Configuration

```dotenv
PORT=
FRONTEND_URL=
DATABASE_URL=

TOKEN_TTL_HOURS=

EMAIL_CLIENT_HOST=
EMAIL_CLIENT_PORT=

WEATHER_CLIENT_HOST=
WEATHER_CLIENT_PORT=

DB_NAME=
DB_USER=
DB_PASSWORD=
```

## Running the Application

From the root directory of the whole project, run:

```bash
$ npm run start:subscription
```

## Metrics

This microservice integrates Prometheus metrics to track key events in the subscription lifecycle. These metrics are
critical for ensuring the health, performance, and correctness of subscription-related operations such as creation,
confirmation, and validation.

| Metric Name                                | Type      | Labels      | Description                                                                      |
|--------------------------------------------|-----------|-------------|----------------------------------------------------------------------------------|
| `subscription_created_total`               | Counter   | `status`    | Total subscription creation attempts, labeled by `success` or `fail`.            |
| `subscription_confirmed_total`             | Counter   | –           | Total number of confirmed subscriptions.                                         |
| `subscription_deleted_total`               | Counter   | –           | Total number of deleted (unsubscribed) subscriptions.                            |
| `subscription_processing_duration_seconds` | Histogram | –           | Time taken to process a subscription (create, confirm, unsubscribe).             |
| `subscription_count`                       | Gauge     | `confirmed` | Current number of subscriptions labeled by confirmation status (`true`/`false`). |
| `city_validation_fail_total`               | Counter   | –           | Total number of failed city validation attempts during subscription.             |
| `invalid_token_total`                      | Counter   | –           | Total invalid token uses during confirmation or unsubscription.                  |

## Viewing Metrics

1. Pushgateway Dashboard. Visit http://localhost:9091 to view real-time metrics pushed by the Subscription service.
2. Prometheus with Grafana (optional): Configure Prometheus to scrape from Pushgateway to enable alerting and long-term
   storage. Open `http://localhost:3000` and add `Prometheus` as a data source. Use the following query to visualize
   email metrics: