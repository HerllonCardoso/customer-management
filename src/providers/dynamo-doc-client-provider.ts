import { DynamoDB } from "aws-sdk";

export class DynamoDBClient {
  private static instance: DynamoDB.DocumentClient;

  private constructor() {}

  public static getInstance(): DynamoDB.DocumentClient {
    if (!DynamoDBClient.instance) {
      const IS_OFFLINE = process.env.IS_OFFLINE;
      DynamoDBClient.instance =
        IS_OFFLINE === "true"
          ? new DynamoDB.DocumentClient({
              region: process.env.AWS_REGION_ENV,
              endpoint: process.env.DYNAMODB_ENDPOINT,
              accessKeyId: process.env.ACCESS_KEY_ID,
              secretAccessKey: process.env.SECRET_ACCESS_KEY,
            })
          : new DynamoDB.DocumentClient();
    }

    return DynamoDBClient.instance;
  }
}
