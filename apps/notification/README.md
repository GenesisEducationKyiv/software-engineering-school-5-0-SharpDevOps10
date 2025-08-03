# Notification Service

A microservice responsible for managing and sending scheduled weather notifications to subscribers. Built with NestJS,
it handles automated email dispatching based on user subscription preferences.

## Features

- Scheduled notification system
- Multiple notification frequencies:
    - Hourly updates
    - Daily updates (8 AM)
    - Test mode (every 30 seconds)
- Integration with Weather and Email services
- Cron job management
- TypeScript support
- Comprehensive testing setup
- Metrics and monitoring

## Prerequisites

- Node.js (v18 or higher)
- npm package manager
- Running instances of:
    - Weather Service
    - Email Service
    - Subscription Service

## Installation

```bash
$ npm install
```

## Configuration

```dotenv
PORT=
WEATHER_CLIENT_HOST=
WEATHER_CLIENT_PORT=

SUBSCRIPTION_CLIENT_HOST=
SUBSCRIPTION_CLIENT_PORT=

EMAIL_CLIENT_HOST=
EMAIL_CLIENT_PORT=
```

## Running the Application

From the root directory of the whole project, run:

```bash
$ npm run start:notification
```

## Scheduled Emails

Using `@nestjs/schedule`, the service:

* Sends weather emails every hour to users with `hourly` frequency
* Sends weather emails every day to users with `daily` frequency

The email includes temperature, humidity, and description for the subscriber's city.

## Metrics

This microservice integrates Prometheus metrics to provide real-time observability of its core operations, including
email dispatch and subscription retrieval. These metrics are periodically pushed to a Prometheus Pushgateway and are
exposed in standard Prometheus format.

| Metric Name                                | Type      | Labels                | Description                                                                   |
|--------------------------------------------|-----------|-----------------------|-------------------------------------------------------------------------------|
| `notification_email_send_attempts_total`   | Counter   | `status`, `frequency` | Total email send attempts, labeled by success/failure and frequency.          |
| `notification_email_send_duration_seconds` | Histogram | `frequency`           | Duration of sending emails, labeled by notification frequency (e.g., hourly). |
| `subscription_fetch_attempts_total`        | Counter   | `status`, `frequency` | Total attempts to fetch confirmed subscriptions, labeled by status/frequency. |
| `subscription_fetch_duration_seconds`      | Histogram | `frequency`           | Time taken to fetch subscriptions, labeled by frequency.                      |

### Viewing Metrics

Metrics are pushed periodically to a Pushgateway configured for this service.

1. Pushgateway Dashboard. Open http://localhost:9091 in your browser to inspect metrics submitted by the Notification
   service.
2. Prometheus with Grafana (optional): Configure Prometheus to scrape from Pushgateway to enable alerting and long-term
   storage. Open `http://localhost:3000` and add `Prometheus` as a data source. Use the following query to visualize
   email metrics: