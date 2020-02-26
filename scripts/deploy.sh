set -e
echo "deplyoment started"
echo "\tcleaning..."
sh ./scripts/clean.sh
echo "\tbuilding..."
sh ./scripts/build.sh
echo "\tsyncing..."
aws s3 sync ./.temp/pack s3://$NY_WEB_S3_BUCKET --delete --acl public-read --cache-control max-age=0
echo "deployment finished"