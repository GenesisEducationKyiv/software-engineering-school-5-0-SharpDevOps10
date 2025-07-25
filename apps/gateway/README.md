A gateway service that acts as a unified entry point for the microservices' architecture. Built with NestJS, it routes
and manages requests to various microservices including weather, subscription, email, and notification services.

## Features

- Centralized routing to microservices
- Request validation and transformation
- Load balancing
- Service discovery
- Metrics collection and monitoring
- Error handling and response normalization
- TypeScript support
- Comprehensive testing setup

## Prerequisites

- Node.js
- npm package manager
- Docker and Docker Compose (for running with other services)
- Running instances of dependent microservices:
    - Weather Service
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
$ npm run start:gateway
```