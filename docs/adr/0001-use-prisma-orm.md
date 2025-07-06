# ADR 0001: Choose the ORM for the Database Access

**Status:** Accepted

**Date:** 2025-06-07

**Author:** Danyil Tymofeiev

## Context

We are developing a backend service using NestJS that performs the following key functions:

* Manages user subscriptions, allowing users to subscribe to weather updates for specific locations and time intervals
  (e.g., hourly, daily).
* Sends notifications via email to users based on their subscription preferences.

Our goal is to find an Object-Relational Mapping (ORM) solution that supports:

* **Type-safe queries**: we want the compiler to catch query-related errors at development time, especially for complex
  nested queries involving subscriptions.
* **Schema migrations**: since our domain model will evolve, we need a reliable and version-controlled way to update
  the database schema.
* **PostgreSQL's compatibility**: we use PostgreSQL as our database engine, and we need first-class support for
  PostgreSQL-specific features like JSONB fields.
* **High developer productivity**: we prioritize fast iteration and want tooling that _automates boilerplate_,
  simplifies data modeling, and integrates smoothly with the NestJS architecture. _By "automates boilerplate," we mean
  that the tool should generate repetitive code such as model classes, CRUD operations, and TypeScript types
  automatically from the schema—rather than requiring the developer to hand-code each of these layers manually_.

## Considered Options

### Prisma ORM

* **Pros**:
    * Strong, generated type safety – every query is checked at compile time via the auto-generated `Prisma Client`.
    * Single-source-of-truth schema and declarative migrations – `schema.prisma` drives both SQL generation and client
      types, giving reviewable SQL migration files.
    * Rich tooling out of the box – Studio (GUI), Accelerate (connection pooling and caching), Pulse (real-time events).
    * Excellent DX – mature docs, JetBrains/VSC plugins, and a very active community.
* **Cons**:
    * No first-class query-builder – anything non-trivial (CTEs, window functions, partially selects) quickly degrades
      to
      `db.$queryRaw`.
    * Regeneration workflow gotchas – forgetting `prisma generate` after every model change breaks type safety and CI.

### TypeORM

* **Pros**:
    * TypeScript-first with decorators – entities look like plain classes; strong typing without external codegen.
    * Rich features set – caching, soft-delete, listeners/subscribers, automatic migrations, and support for > 10 SQL
      engines.
* **Cons**:
    * Fragile migrations – auto-generation frequently produces spurious diffs or empty files, forcing manual edits and
      review time.
    * Default lazy/eager settings often fire dozens of extra queries or huge joins unless every request is hand-tuned.
    * Breaking changes - the 0.2 → 0.3 jump (DataSource, CLI flags, deprecated `ormconfig.json`) forced invasive
      rewrites.

### Sequelize

* **Pros**:
    * Sequelize supports the widest range of SQL dialects with transactions and hooks.
    * Low entry barrier – simple class-based model definitions, abundant tutorials.
* **Cons**:
    * Weaker TypeScript story – typings exist but still demand manual model interfaces and provide limited compile-time
      safety compared with Prisma or TypeORM.
    * Object (de)serialization and deep cloning hurt large result-sets; transactions are very slow.

## Decision

We have chosen **Prisma** as our ORM as the `schema.prisma` file keeps entity definitions, relations, and constraints in
one place. In addition, **Prisma** generates a strongly typed client with CRUD helpers and nested selects, eliminating
hundreds of handwritten repository lines. JSONB columns are officially supported as well.

## Consequences

**Positive**:

* Prisma Migrate ensures that the database structure, generated client, and TypeScript types remain consistent, reducing
  runtime errors.
* Auto-generated CRUD helpers and end-to-end type safety cut boilerplate, letting developers focus on domain logic.
* Every schema change produces a readable SQL file committed to VCS, giving a clear migration history for code reviews
  and
  rollbacks.
* New team members can visually explore data with Prisma Studio and rely on the IDE's powerful autocompletion features
  to reduce a learning curve.

**Negative**:

* Forgetting to run prisma generate after a schema change breaks compile-time types and CI.
* The Prisma engine binaries and generated client add additional size and require npm post-install steps, slightly
  lengthening CI builds.