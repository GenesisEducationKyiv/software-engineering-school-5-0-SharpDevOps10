# ☀️ Weather Subscription API (NestJS + WeatherAPI + PostgreSQL)

## Description

A modular microservice system for managing weather-based email subscriptions. Built with NestJS, the system allows users
to subscribe to weather updates for their cities and receive scheduled notifications based on their preferred
frequency (`hourly` or `daily`). The solution is deployed using Docker and supports PostgreSQL, Redis, and external
APIs.

## Architecture Overview

The system consists of the following microservices:

* **Weather Service** — Retrieves weather data from external APIs and caches results.
* **Email Service** — Sends emails using templates via SMTP.
* **Notification Service** — Schedules and dispatches weather update emails.
* **Subscription Service** — Manages subscriptions, confirmation, and unsubscription.
* **Gateway Service** — Routes and aggregates external API requests.

Each microservice has its own README with installation and configuration details:

* [Weather Service](apps/weather/README.md)
* [Subscription Service](apps/subscription/README.md)
* [Email Service](apps/email/README.md)
* [Notification Service](apps/notification/README.md)
* [Gateway](apps/gateway/README.md)

## Features:

* Weather data fetching from WeatherAPI.com
* Email subscription with confirmation token
* Hourly and daily notification scheduling
* Validation for valid city names
* Email sending with template support
* Docker and Docker Compose ready
* Prisma for DB access and migrations
* Deployment on AWS EC2 instance; HTML subscription form: http://16.171.151.84/ (**EXTRA task**)

## Installation

* First and foremost, you need to make sure that you have installed [Node.js](https://nodejs.org/en)
* After that, you have to clone this repository and enter the working folder:

```bash
$ git clone https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-SharpDevOps10.git
$ cd software-engineering-school-5-0-SharpDevOps10
$ npm install
```

## Environment Setup

Each microservice has its own `.env` file. See individual service READMEs for required variables.

## Run with Docker Compose

To run the entire system using Docker Compose, execute the following command from the root directory:

```bash
$ docker compose up -d
```

## Run Individually

To run each service individually, navigate to the respective service directory and run:

```bash
$ npm run start:gateway
$ npm run start:subscription
$ npm run start:email
$ npm run start:weather
$ npm run start:notification
```

## Extra Task

I've also added an HTML form for subscribing to weather updates. You can find it in the `src/public/` folder. Here
is the link to the form: http://16.171.151.84/

## Tests

The test-cases are located in the microservice apps. You can run them using the following command:

```bash
$ npm run test:all
```

## Continuous Integration and Continuous Deployment

I have also added CI/CD pipelines using GitHub Actions (located in `.github` folder) for building + pushing the image to
[Dockerhub](https://hub.docker.com/repository/docker/rerorerio8/genesis-case-task/general) and running tests. Here you
can find my [All Workflows](https://github.com/SharpDevOps10/genesis-case-task/actions)

## Logging (Pino)

Logs are handled using nestjs-pino for structured JSON logs.

| Level   | Sampling Rate | Description                                            |
|---------|---------------|--------------------------------------------------------|
| `error` | 100% (all)    | All critical errors are logged without sampling.       |
| `warn`  | 20%           | Warnings are selectively logged for anomaly detection. |
| `info`  | 20%           | Informational logs for operational insights.           |
| `debug` | 30%           | Verbose logs used mainly in development/testing.       |

Logs are pushed to the console or centralized log system `Loki` based on deployment configuration.

Log example:

```json
{
  "level": 30,
  "time": 1754230164262,
  "context": "EmailConsumer",
  "method": "handleSendEmail",
  "msg": "Finished processing SEND_EMAIL"
}
```
