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

## Metrics

This microservice integrates Prometheus metrics to monitor the performance and reliability of Redis caching and external
weather API interactions. These metrics help ensure efficient caching behavior, API responsiveness, and error tracking.

| Metric Name                         | Type      | Labels | Description                                                                |
|-------------------------------------|-----------|--------|----------------------------------------------------------------------------|
| `redis_requests_total`              | Counter   | –      | Total number of Redis read requests (hits + misses).                       |
| `redis_hits_total`                  | Counter   | –      | Total successful cache hits (data retrieved from Redis).                   |
| `redis_misses_total`                | Counter   | –      | Total cache misses (fallback to external API).                             |
| `redis_errors_total`                | Counter   | –      | Total number of Redis operation errors (e.g., connection or query issues). |
| `redis_response_time_seconds`       | Histogram | –      | Response time for Redis read operations (latency measurement).             |
| `redis_writes_total`                | Counter   | –      | Total number of Redis write operations (data cached).                      |
| `redis_write_errors_total`          | Counter   | –      | Total failed write attempts to Redis.                                      |
| `redis_write_response_time_seconds` | Histogram | –      | Response time for Redis write operations.                                  |

## Viewing Metrics

1. Pushgateway Interface. Access metrics at: http://localhost:9091 (or your configured Pushgateway URL).
2. Prometheus with Grafana (optional): Configure Prometheus to scrape from Pushgateway to enable alerting and long-term
   storage. Open `http://localhost:3000` and add `Prometheus` as a data source. Use the following query to visualize
   email metrics: