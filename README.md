# Prismic Field Migrator

A script for moving a slice's fields to other fields within a Prismic repository. This could be used to migrate from old to new feautres, like moving `link`, `link_label` and `link_style` from the `slice.items` array into the new repeatable link field that now supports `variations` and `text` properties.

Before running the script, ensure you have added the new fields to the slices where you want to migrate fields.

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
