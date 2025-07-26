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