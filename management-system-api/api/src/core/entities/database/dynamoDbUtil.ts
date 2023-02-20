import AWS from "aws-sdk";
import {
  DeleteItemInput,
  PutItemInput,
  GetItemOutput,
  PutItemInputAttributeMap,
  PutItemOutput,
  QueryInput,
  ScanInput,
  ScanOutput,
  TransactWriteItemsInput,
  TransactWriteItemsOutput,
} from "aws-sdk/clients/dynamodb";
import { DBUtil, DBError } from "./dbUtil";
import { internal } from "../../model";

interface CompositeKey {
  partitionKey: string;
  rangeKey?: string;
}
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

  // query utils
  async getOneByPrimaryKey(tableName: string, keyValueObject: any) {
    let params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      Key: keyValueObject,
      TableName: tableName,
    };
    try {
      let res = await this.dynamoDb.get(params).promise();
      console.log("Queried item: ", res.Item);
      return res.Item;
    } catch (e) {
      console.error(
        `TableName: ${tableName}, Operation: getOneByPrimaryKey, Error: `,
        e
      );
      throw new DBError(
        `Error while getOneByPrimaryKey in ${tableName} : ${e} `
      );
    }
  }

  async queryTable(
    tableName: string,
    query: internal.DBQuery,
    primaryKeyFieldName: CompositeKey,
    indexKeyFieldName: string,
    primaryKey?: CompositeKey,
    indexKey?: string
  ): Promise<ScanOutput> {
    let params: QueryInput;
    let res: any;
    if (primaryKey && primaryKey.partitionKey) {
      params = this.getQueryParams(
        tableName,
        primaryKeyFieldName,
        primaryKey,
        query.limit,
        query.offset
      );
    } else {
      params = this.getIndexQueryParam(
        tableName,
        indexKeyFieldName,
        indexKey,
        query.limit,
        query.offset
      );
    }
    try {
      res = await this.dynamoDb.query(params).promise();
      console.log("Queried items: ", res);
    } catch (e) {
      console.error(
        `TableName: ${tableName}, Operation: queryTable, Error: `,
        e
      );
      throw new DBError(` Error while queryTable in ${tableName} : ${e} `);
    }
    return res;
  }

  async scanTable(
    tableName: string,
    query: internal.DBQuery
  ): Promise<ScanOutput> {
    let param = this.getScanParam(tableName!, query!.limit, query!.offset);
    let res: AWS.DynamoDB.DocumentClient.ScanOutput;
    let cache: any = [];
    let remining: number;
    let totalRecords = param.Limit!;
    try {
      do {
        res = await this.dynamoDb.scan(param).promise();
        cache = [...cache, ...res.Items!];
        remining = totalRecords - cache.length!;
        console.log(`scaned ${cache.length} items and remininig ${remining}`);
        if (res?.LastEvaluatedKey !== undefined) {
          param.ExclusiveStartKey = res!.LastEvaluatedKey;
          param.Limit = remining;
        }
      } while (
        cache.length! < totalRecords &&
        res.LastEvaluatedKey !== undefined
      );
      res.Items! = cache;
    } catch (e) {
      console.error(
        `TableName: ${tableName}, Operation: scanTable, Error: `,
        e
      );
      throw new DBError(` Error while scanTable in ${tableName} : ${e} `);
    }

    console.log("Queried items: ", res);
    return res;
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

  // delete functions
  async deleteItem(tableName: string, keyValueObject: any): Promise<any> {
    try {
      let param = this.getDeleteParam(tableName!, keyValueObject);
      let res = await this.dynamoDb.delete(param).promise();
      console.log("DB Response: ", res);
      return res.Attributes;
    } catch (e) {
      console.error(
        `TableName: ${tableName}, Operation: deleteItem, Error: `,
        e
      );
      throw new DBError(` Error while deleteItem in ${tableName} : ${e} `);
    }
  }

  // other utils
  getQueryParams(
    tableName: string,
    key: CompositeKey,
    value: CompositeKey,
    limit: any = 100,
    offset: any = null
  ) {
    let params: QueryInput;
    if (typeof limit != "number") {
      throw ` limit value must be number not ${typeof limit} `;
    }

    let keyConditionExpression = [];
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};

    if (value.partitionKey != null) {
      keyConditionExpression.push("#partitionKey=:partitionValue");
      expressionAttributeNames["#partitionKey"] = key.partitionKey;
      expressionAttributeValues[":partitionValue"] = value.partitionKey;
    }

    if (value.rangeKey != null) {
      keyConditionExpression.push("#rangeKey=:rangeValue");
      expressionAttributeNames["#rangeKey"] = key.rangeKey;
      expressionAttributeValues[":rangeValue"] = value.rangeKey;
    }

    params = {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression.join(" AND "),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: limit,
      ExclusiveStartKey: offset,
    };
    return params;
  }

  getIndexQueryParam(
    tableName: string,
    indexKey: string,
    value: any,
    limit: any = 100,
    offset: any = null
  ) {
    let params: QueryInput;
    if (typeof limit != "number") {
      throw ` limit value must be number not ${typeof limit} `;
    }
    params = {
      TableName: tableName,
      IndexName: `${indexKey}-index`,
      KeyConditionExpression: "#index =:value",
      ExpressionAttributeNames: {
        "#index": indexKey,
      },
      ExpressionAttributeValues: {
        ":value": value,
      },
      Limit: limit,
      ExclusiveStartKey: offset,
    };
    return params;
  }

  getScanParam(tableName: string, limit: any = 100, offset: any = null) {
    if (typeof limit != "number") {
      throw ` limit value must be number not ${typeof limit} `;
    }
    let params: ScanInput;
    params = {
      TableName: tableName,
      Limit: limit,
      ExclusiveStartKey: offset,
    };
    return params;
  }

  getPutItemParams(tableName: string, item: PutItemInputAttributeMap) {
    let params: PutItemInput = {
      TableName: tableName,
      Item: item,
      ReturnValues: "ALL_OLD",
    };
    return params;
  }

  getDeleteParam(tableName: string, key: any) {
    let params: DeleteItemInput = {
      TableName: tableName,
      Key: key,
      ReturnValues: "ALL_OLD",
    };
    return params;
  }
}
