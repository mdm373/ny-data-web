S3_BUCKET=$(cat ./.secrets.json | jq -r '.S3_BUCKET')
sh ./scripts/clean.sh
sh ./scripts/build.sh
aws s3 sync ./.temp/pack s3://$S3_BUCKET --delete --acl public-read --cache-control max-age=0