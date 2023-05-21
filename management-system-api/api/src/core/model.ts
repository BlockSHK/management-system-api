export enum ErrorCode {
  DB_ERROR = "DB_ERROR",
  WEB3_ERROR = "WEB3_ERROR",
  INVALID_DATA = "INVALID_DATA",
  CORRUPTED_DATA = "CORRUPTED_DATA",
  CONTRACT_INACCESSIBLE = "CONTRACT_INACCESSIBLE",
  INVALID_CONTRACT = "INVALID_CONTRACT",
  INVALID_LICENSE = "INVALID_LICENSE",
  UNAUTHORIZED = "UNAUTHORIZED",
  ALREADY_DEPLOYED = "ALREADY_DEPLOYED",
  ACTIVATION_FAILED = "ACTIVATION_FAILED",
}
export enum Blockchain {
  ETHEREUM = "ETHEREUM",
  POLYGON = "POLYGON",
  BSC = "BSC",
}
export interface Contract {
  blockchain: Blockchain;
  address?: string;
  name: string;
  type: ContractTypes;
  metadata?: any;
  properties?: any[];
}
export enum ContractFileType {
  ABI = "abi",
  BIN = "bin",
}

export enum ContractTypes {
  PERPETUAL = "PERPETUAL",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export enum LicenseTypes {
  CONTRACT_PERPETUAL = "CONTRACT_PERPETUAL",
  CONTRACT_FIXED_SUBSCRIPTION = "CONTRACT_FIXED_SUBSCRIPTION",
  CONTRACT_AUTO_RENEW_SUBSCRIPTION = "CONTRACT_AUTO_RENEW_SUBSCRIPTION",
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
  export interface Session {
    nonce: string;
    address: string;
    timestamp: number;
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
  import Query = internal.DBQuery;
  export interface LicenseInput {
    software: string;
    type: LicenseTypes;
    name: string;
    description: string;
    image: string;
    metadata: string;
    company: string;
    price: string;
    owner: string;
    subscriptionPeriod?: number;
    paymentToken?: string;
  }
  export interface LicenseQuery extends Query {
    filter?: {
      id?: string;
      software?: string;
    };
  }
  export interface LicenseUpdate extends LicenseInput {
    status: LicenseStatus;
    contract?: Contract;
  }
  export interface LicensePurchaseInput {
    address: string;
  }

  export interface NonceRequest {
    address: string;
  }

  export interface ActivationVerificationRequest {
    address: string;
    contract: string;
    tokenId: string;
    nonce: string;
    sign: string;
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
  export interface QueryResponse {
    count: number;
    offset: any;
    limit: number;
    records: internal.License[];
  }
  export interface NonceResponse {
    address: string;
    nonce: string;
    timestamp: number;
  }

  export interface ActivationVerificationResponse {
    activate: string;
    credential: Object;
    timestamp: number;
  }
}
