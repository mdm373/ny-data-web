set -e
mkdir -p ./.lib/
mkdir -p ./.temp/swagger
SPEC_FILE=$NY_WEB_API_HOST/swagger-ui/swagger.yaml
rm -rf ./src/generated
echo "pulling swagger spec from: $SPEC_FILE"
curl $SPEC_FILE -o ./.temp/swagger/nydata-spec.yaml
if ! [ -f ./.lib/swagger-codegen-cli.jar ]
then
    curl http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.10/swagger-codegen-cli-2.4.10.jar -o ./.lib/swagger-codegen-cli.jar
else
    echo using existing codegen cli
fi
java -jar ./.lib/swagger-codegen-cli.jar generate -i ./.temp/swagger/nydata-spec.yaml -l typescript-fetch -o ./src/generated/nydata-api