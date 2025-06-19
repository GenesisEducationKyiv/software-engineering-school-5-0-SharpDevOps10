# Testing doc

## How to run unit tests

Firstly, install the dependencies:

```bash
$ npm install
```

Then, run the tests:

```bash
$ npm run test:unit                                                             
```

## How to run integration tests
Firstly, install the dependencies:

```bash
$ npm install
```

Then run the container:

```bash
$ docker compose -f docker-compose.test.yml up -d 
```

Then, run the tests:

```bash
$ npm run test:integration
```

## How to run all tests
```bash
$ npm run test:all
```