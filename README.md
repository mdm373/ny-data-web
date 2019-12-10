# NY Data Web
> A Web frontend for ny data

See [ingest](https://github.com/mdm373/ny-data-ingest) and [api](https://github.com/mdm373/ny-data-api) for data source details

## Pre-Requisits
* for deployment
  * aws-cli
  * jq
* for development
  * node

 ## Install
 ```
 npm install
 ```
 Create a `.secrets.json` in the project root with this scheme
 ```
 {
    "S3_BUCKET": "YOUR_S3_BUCKET_NAME",
    "APP_CONFIG" : {
        "LOCAL" : {
            "apiDomain" : "http://domain-to-hit-for-local"
        },
        "HOSTED" : {
            "apiDomain" : "https://domain-to-hit-when-deployed"
        }
    }
}
 ```
 Deployment assumes a web served cloud formation serving from s3.

 ## Scripts
 * `npm run dev-serve`: runs a watched static asset server on port `80` or `APP_PORT` env var
 * `npm run deploy`: builds and syncs with configured s3