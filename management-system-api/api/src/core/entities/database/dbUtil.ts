import { internal, ErrorCode } from "../../model";

export interface DBUtil {
  // insert/update functions
  writeOneToDB(tableName: string, item: any): Promise<any>;
  transactWriteDB(params: any): Promise<any>;
}

export class DBError extends Error {
  constructor(
    readonly message: string,
    readonly errorCode: string = ErrorCode.DB_ERROR
  ) {
    super(message);
  }
}
