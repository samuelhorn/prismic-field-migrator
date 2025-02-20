# Field Updater

A script for moving link, link_label and link_style fields from the repeatable zone of a slice to a new repeatable link field.

## To run

### Environment

1. Setup in .src/config.ts

2. Create a .env.local file containing:

```
MIGRATION_TOKEN=
REPOSITORY=
API_KEY=
API_ENDPOINT=https://migration.prismic.io/documents/
```

## Do a migration

Run `pnpm run migrate`
