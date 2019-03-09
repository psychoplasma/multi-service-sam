# multi-service, mono-repo SAM
multi-service & mono-repo serverless application model with dynamodb-local and layers support

This repo includes 4 + 1 (Labmda Functions as a separate services) separate services as follows;

 1. storage-s3 (AWS S3 Bucket), 
 2. dynamodb (AWS DynamoDB),
 3. cognito (AWS Cognito), 
 4. api-gateway (AWS RestApi ApiGateway), 
 5. api (AWS Lambda Functions)
    - users (AWS Lambda Functions)
    - notes (AWS Lambda Functions)
    

### Setup
```bash
  $ npm install

  $ npm install serverless -g
```

### Deploy
- In order to see debug logs, before running the deploy command, export the serverless debug environment variable as follows
```bash
  $ export SLS_DEBUG=*
```

- In order to deploy the whole mutli-service app
```bash
  $ STAGE=<stage_name> npm run deploy
```

- In order to update the whole mutli-service app
```bash
  $ STAGE=<stage_name> npm run deploy
```

- In order to remove the whole mutli-service app
```bash
  $ STAGE=<stage_name> npm run remove
```

- In order to deploy a lambda service
```bash
  $ STAGE=<stage_name> npm run deploy-api-<service_name>
```

- In order to deploy the whole lambda services
```bash
  $ STAGE=<stage_name> npm run deploy-api
```

- In order to deploy the whole resources which includes S3 storage, DynamoDB, Cognito and Api GateWay services
```bash
  $ STAGE=<stage_name> npm run deploy-resources
```

* Be careful when using `remove` command which will completely delete targeted stack
* See the `package.json` for the corresponding service stack names


### Local Deployment for API services
* First intialize mock tables from `mock-<table_name>-table.json` under `./test/mock` folder. The field names and types should coincide with the table definition in `resources/dynamodb/resources/tables.yml` file.
* And then run the following commands for the corresponding tests
```bash
  # For example, in order to test users service
  $ npm run test-users
  # Or, in order to test campaigns service
  $ npm run test-notes
```

### Notices
* In order to be able to test lambda services with dynamodb-local, you need to replace all `aws-sdk` dynamodb instances with `serverless-dynamodb-client` dynamodb instances. `serverless-dynamodb-client` library will automatically will initialize the corresponding aws credentials and dynamodb instances for you.

```javascript
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  // The above dynamodb instances should be replaced with below
  const dynamoDbClient = require('serverless-dynamodb-client');
  const dynamoDb = dynamoDbClient.doc;
```
* Check the environment variables for the table names from `<lambda_service>/serverless.yml` file and use accordingly in your code.
* Libraries which are used through aws layers service should be imported from `/opt/<layer_name>/<file_name>`
For example, let's say the layer name is `lib` and the file that you want to import is `awsomeLibrary.js`, then
```javascript
  const { foo, baz } = require('/opt/lib/awsomeLibrary');
```
