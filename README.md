# NY Data Web

> A Web frontend for ny data

See [ingest](https://github.com/mdm373/ny-data-ingest) and [api](https://github.com/mdm373/ny-data-api) for data source details

## Tooling

- source: webpack, typescript, react, react-redux, rxjs, sass, bootstrap, swagger-codegen
- infra: s3 / cloud-formation (serverless)

## Pre-Requisites

- for deployment
  - aws-cli
- for development
  - node / npm
  - java (swagger code generation)

## Install

```bash
npm install
```

Populate local .env and .env.hosted with values as required. Ensure any added .env files are ignored from git as .env files may contain sensitive information.

## Scripts

- `npm run dev-serve`: runs a watched static asset server on port `80` or `APP_PORT` env var
- `npm run deploy`: builds and syncs with configured s3
