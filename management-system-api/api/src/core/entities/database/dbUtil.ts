import { internal, ErrorCode } from "../../model";

export interface DBUtil {
  // query functions
  getOneByPrimaryKey(tableName: string, keyValueObject: any): Promise<any>;
  queryTable(
    tableName: string,
    query: internal.DBQuery,
    primaryKeyFieldName: any,
    indexKeyFieldName: string,
    primaryKey?: any,
    indexKey?: string
  ): Promise<any>;
  scanTable(
    tableName: string,
    query: internal.DBQuery,
    filterAttributes?: { key: string; value: any }[]
  ): Promise<any>;

  // insert/update functions
  writeOneToDB(tableName: string, item: any): Promise<any>;
  transactWriteDB(params: any): Promise<any>;

  // delete functions
  deleteItem(tableName: string, keyValueObject: any): Promise<any>;
}

export class DBError extends Error {
  constructor(
    readonly message: string,
    readonly errorCode: string = ErrorCode.DB_ERROR
  ) {
    super(message);
  }
}
