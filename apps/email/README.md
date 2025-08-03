# Email Microservice

A microservice responsible for handling email operations within the system. Built with NestJS and integrated with
nodemailer for reliable email delivery.

## Features

- Email sending functionality
- Template-based email composition using Handlebars
- Environment-based configuration
- TypeScript support

## Prerequisites

- Node.js (v18 or higher)
- npm package manager

## Installation

```bash
$ npm install
```

## Dependencies

Main dependencies include:

- @nestjs/common (^10.0.0)
- @nestjs/config (^4.0.2)
- @nestjs-modules/mailer (^2.0.2)
- nodemailer (^7.0.3)
- handlebars (^4.7.8)

## Configuration

```dotenv
PORT=
FRONTEND_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

## Running the Application

From the root directory of the whole project, run:

```bash
$ npm run start:email
```

## Metrics

This microservice integrates Prometheus metrics. These tools enable observability,
help monitor system health, and assist in debugging and performance tuning.

Email service metrics are pushed to a Prometheus `Pushgateway` and exported in standard Prometheus format.

| Metric Name                          | Type      | Labels               | Description                                                |
|--------------------------------------|-----------|----------------------|------------------------------------------------------------|
| `email_send_total`                   | Counter   | `status`, `template` | Total email send attempts, categorized by success/failure. |
| `email_send_duration_seconds`        | Histogram | `template`           | Duration of email sending per template (e.g., `confirm`).  |
| `email_events_processed_total`       | Counter   | –                    | Total events received from the message queue.              |
| `template_validation_failures_total` | Counter   | `template`           | Number of failed template validations.                     |

### Viewing Metrics

Metrics are pushed periodically to a Pushgateway.

1. Pushgateway UI: Visit `http://localhost:9091` in your browser to view pushed metrics.
2. Prometheus with Grafana (optional): Configure Prometheus to scrape from Pushgateway to enable alerting and long-term
   storage. Open `http://localhost:3000` and add `Prometheus` as a data source. Use the following query to visualize
   email metrics:
