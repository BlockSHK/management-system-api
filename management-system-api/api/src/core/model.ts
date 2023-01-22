export enum ErrorCode {
  DB_ERROR = "DB_ERROR",
  WEB3_ERROR = "WEB3_ERROR",
  INVALID_DATA = "INVALID_DATA",
  CORRUPTED_DATA = "CORRUPTED_DATA",
}

export enum ContractTypes {
  PERPETUAL = "PERPETUAL",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export enum LicenseTypes {
  CONTRACT_PERPETUAL = "CONTRACT_PERPETUAL",
  CONTRACT_SUBSCRIPTION = "CONTRACT_SUBSCRIPTION",
  TOKEN_PERPETUAL = "TOKEN_PERPETUAL",
  TOKEN_SUBSCRIPTION = "TOKEN_SUBSCRIPTION",
}

export enum RejectCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

export enum LicenseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export namespace internal {
  export interface DBQuery {
    offset?: any;
    limit?: number;
  }

  export interface License extends apiInput.LicenseInput {
    id: string;
    status: LicenseStatus;
    owner: string;
    contract?: any;
    token?: any;
  }
}

export namespace apiInput {
  export interface LicenseInput {
    software: string;
    type: LicenseTypes;
    name: string;
    description: string;
    image: string;
  }
}

export namespace apiOutput {
  export enum RejectCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND",
    CONTRACT_NOT_FOUND = "CONTRACT_NOT_FOUND",
    WRONG_REQUEST_TYPE = "WRONG_REQUEST_TYPE",
    AUTH_FAILURE = "AUTH_FAILURE",
  }
}
