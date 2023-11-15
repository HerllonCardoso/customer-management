import { ICustomer } from "../interfaces/customer-interface";
import { DynamoDBClient } from "../providers/dynamo-doc-client-provider";

export class CustomerRepository {
  private readonly dynamoDBClient = DynamoDBClient.getInstance();
  private readonly tableName = "CustomerTable";

  constructor() {}

  async findOne(id: string) {
    try {
      const output = await this.dynamoDBClient
        .get({
          TableName: this.tableName,
          Key: {
            id,
          },
        })
        .promise();

      if (!output.Item) {
        return null;
      }

      return output.Item;
    } catch (err) {
      console.log(err);
    }
  }

  async find() {
    try {
      return await this.dynamoDBClient
        .scan({
          TableName: this.tableName,
        })
        .promise();
    } catch (err) {
      console.log(err);
    }
  }

  async createOrUpdate(customer: ICustomer) {
    try {
      return await this.dynamoDBClient
        .put({
          TableName: this.tableName,
          Item: customer,
        })
        .promise();
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: string) {
    try {
      return await this.dynamoDBClient
        .delete({
          TableName: this.tableName,
          Key: {
            id,
          },
        })
        .promise();
    } catch (err) {
      console.log(err);
    }
  }
}
