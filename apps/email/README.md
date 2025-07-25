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