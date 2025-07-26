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