import AWS from "aws-sdk";
import {
  PutItemInput,
  PutItemInputAttributeMap,
  TransactWriteItemsInput,
  TransactWriteItemsOutput,
} from "aws-sdk/clients/dynamodb";
import { DBUtil, DBError } from "./dbUtil";

export class DynamoDbUtil implements DBUtil {
  private dynamoDb: AWS.DynamoDB.DocumentClient;
  private static dynamoDbUtil: DynamoDbUtil;

  private constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
  }

  public static init(): DynamoDbUtil {
    if (!DynamoDbUtil.dynamoDbUtil) {
      console.log("dynamodb client creation");
      DynamoDbUtil.dynamoDbUtil = new DynamoDbUtil();
    }

    return DynamoDbUtil.dynamoDbUtil;
  }

  // write utils
  async writeOneToDB(
    tableName: string,
    item: AWS.DynamoDB.DocumentClient.PutItemInputAttributeMap
  ): Promise<any> {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput =
      this.getPutItemParams(tableName, item);
    try {
      let res = await this.dynamoDb.put(params).promise();
      console.log("DB Response: ", res);
      return item; //put method doesn't return the new item entered
    } catch (e) {
      console.error(`Operation: writeToDB, Error: `, e);
      throw new DBError(` Error while writeToDB : ${e} `);
    }
  }

  async transactWriteDB(
    params: TransactWriteItemsInput
  ): Promise<TransactWriteItemsOutput> {
    try {
      let res = await this.dynamoDb.transactWrite(params).promise();
      console.log("DB Response: ", res);
      return res;
    } catch (e) {
      console.error(`Operation: transactWriteDB, Error: `, e);
      throw new DBError(` Error while transactWriteDB : ${e} `);
    }
  }

  getPutItemParams(tableName: string, item: PutItemInputAttributeMap) {
    let params: PutItemInput = {
      TableName: tableName,
      Item: item,
      ReturnValues: "ALL_OLD",
    };
    return params;
  }
}
