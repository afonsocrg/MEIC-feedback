# Some notes about D1 and Drizzle

## Connecting to databases

- We can use drizzle-kit to connect to a local or remote database.
- To connect to the local database, we can run `bun db`
- To connect to the remote staging database, we can run `bun db-stg`
- To connect to the remote production database, we can run `bun db-prod`

DBeaver would be a good option to connect to the database and run queries, change tables, etc. The problem is that since the database is SQLite, we would need to refresh the connection every time an external change is made to the database... Drizzle Studio automatically refreshes the connection.

## Migrations

To generate a migration file, run

```
bun drizzle-kit generate --name=<migration_name>
```

The file should be output in `src/db/migrations`.
The migration files should be version controlled!

To apply the migrations locally, run

```bash
bun wrangler d1 migrations apply meic-feedback
```

Before applying the migration to the remote database, create a backup of the remote database, and start by testing the migration on a local copy of the remote database.

To apply the migrations to the remote prod database, run

```bash
bun wrangler d1 migrations apply meic-feedback --remote
```

---

# Old notes

- Cloudflare does not support to run a local D1 instance unless we're using pages.
  However, it's possible to connect drizzle to a local sqlite instance by having the custom code in `drizzle.config.ts`.

- It's good to use the drizzle studio to connect and change the database. We can start the studio with `bun drizzle-kit studio`.

## Drizzle commands

```
npx drizzle-kit generate
```

This command lets us generate SQL migrations based on the Drizzle schema upon declaration or on subsequent schema changes.

---

```
npx drizzle-kit migrate
```

This command applies the current migrations to the database.

---

```
# https://orm.drizzle.team/docs/drizzle-kit-push
npx drizzle-kit push
```

This command gets the current database schema in use, compares it with the schema in `src/db/schema`, generates a migration and immediately runs it. It's good for development and prototyping, but not for production, as it may introduce errors in the database.

## Cloudflare D1 commands

```
bun wrangler d1 create <database_name>
```

This command creates a new database.

```
bun wrangler d1 info <database_name>
```

This command shows information about the database.

## Database Diagram

```
bun drizzle-kit studio
```

This command opens the Drizzle Studio, which is a visual interface for interacting with the database.
