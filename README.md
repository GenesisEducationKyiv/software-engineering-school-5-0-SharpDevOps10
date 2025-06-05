# ☀️ Weather Subscription API (NestJS + WeatherAPI + PostgreSQL)

## Description

This is a case project for Genesis Academy. The backend is built using NestJS and allows users to
subscribe to weather updates for their city using the WeatherAPI.com service. Subscribers can choose the frequency of
updates: `hourly` or `daily`. Confirmed subscribers receive weather updates by email at scheduled intervals. The
application
stores all subscriptions in PostgreSQL and supports confirmation and unsubscription flows.

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
$ git clone https://github.com/SharpDevOps10/genesis-case-task.git
$ cd genesis-case-task
```

* Then you have to install the dependencies for this project:

```bash
$ npm install
```

* Setup environment variables. Copy `.env.example` to `.env`.
* Run migrations:

```bash
$ npx prisma migrate deploy
```

* Generate Prisma client:

```bash
$ npx prisma generate
```

* Start the application:

```bash 
$ npm run start:dev
```

* Or build and run in production mode (it will automatically run migrations + generate Prisma client):

```bash
$ npm run build
$ npm run start:prod
```

* Or you can run the whole project using Docker. Visit my `Dockerization` section of README file for more
  information.

## API Usage

`GET /api/weather?city=Kyiv`

Fetch current weather for a city.

* Query parameters: `city` (required)
* Response: JSON object with weather data:

```json
{
  "temperature": 8.9,
  "humidity": 97,
  "description": "Mist"
}
```

`POST /api/subscribe`

Subscribe to weather updates for a city.

* Body:

```json
{
  "email": "user@example.com",
  "city": "Kyiv",
  "frequency": "daily"
}
```

`GET /api/confirm/{token}`
Confirm email subscription using token from confirmation email.

* `Path param`: token (UUID)

`GET /api/unsubscribe/{token}`
Unsubscribe using token (sent in weather updates).

* `Path param`: token (UUID)

## Extra Task

I've also added an HTML form for subscribing to weather updates. You can find it in the `src/public/` folder. Here
is the link to the form: http://16.171.151.84/

## Dockerization

* If you want to build my image, you should write these commands:

```bash
$ docker build -t weather-subscription-app .
```

* After that, you can run the container using the following command:

```bash
$ docker run -d --env-file .env -p 3000:3000 weather-subscription-app
```

* Or you can run the whole project using Docker Compose. Just run the following command:

```bash
$ docker-compose up -d
```

## Scheduled Emails

Using `@nestjs/schedule`, the service:

* Sends weather emails every hour to users with `hourly` frequency
* Sends weather emails every day to users with `daily` frequency

The email includes temperature, humidity, and description for the subscriber's city.

## Tests

The test-cases are located in the `test` folder. You can run them using the following command:

```bash
$ npm run test
```

## Continuous Integration and Continuous Deployment

I have also added CI/CD pipelines using GitHub Actions (located in `.github` folder) for building + pushing the image to
[Dockerhub](https://hub.docker.com/repository/docker/rerorerio8/genesis-case-task/general) and running tests. Here you
can find my [All Workflows](https://github.com/SharpDevOps10/genesis-case-task/actions)