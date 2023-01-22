import { DynamoDbUtil } from "./database/dynamoDbUtil";
import { DBUtil } from "./database/dbUtil";

export namespace DBService {
  export function getClient(): DBUtil {
    return DynamoDbUtil.init();
  }
}
