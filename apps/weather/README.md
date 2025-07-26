# Weather Service

A microservice responsible for fetching and managing weather data. Built with NestJS, it provides weather information
for various cities and integrates with external weather APIs.

## Features

- Weather data retrieval
- City weather information caching with Redis
- External weather API integration
- Prometheus metrics integration
- TypeScript support
- Comprehensive testing setup
- Rate limiting protection
- Cache invalidation strategies

## Prerequisites

- Node.js
- npm package manager
- Redis (for caching)
- Prometheus Pushgateway (for metrics)

## Installation

```bash
$ npm install
```

## Configuration

```dotenv
PORT=
WEATHER_API_KEY=
WEATHER_API_BASE_URL=
VISUAL_CROSSING_BASE_URL=
VISUAL_CROSSING_API_KEY=
WEATHER_PROVIDERS_PRIORITY=
REDIS_HOST=
REDIS_PORT=
REDIS_TTL=

PROMETHEUS_METRICS_JOB_NAME=
PROMETHEUS_PUSH_GATEWAY_URL=
```

## Running the Application

From the root directory of the whole project, run:

```bash
$ npm run start:weather
```
