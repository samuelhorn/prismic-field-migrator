# Prismic Field Migrator

A script for moving fields to other fields within a Prismic repository.

Before running the script, make sure you have added the new fields to the slices you want to migrate fields on.

## Environment

Create a .env.local file containing:

```
MIGRATION_TOKEN=
REPOSITORY=
API_KEY=
```

## Configure the script

Setup the config in in .src/config.ts, it is typed with explanations what each option does.

## Do a migration

Run `pnpm run migrate`
