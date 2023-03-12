import { NFTError } from "./error";
import { ErrorCode, ContractFileType } from "./model";
import S3 from "aws-sdk/clients/s3";

export namespace util {
  const LICENSE_MANAGMENT_SYSTEM_CONTRACTS_BUCKET = `license-contract-management-system-us-east-1`;
  const TTL = process.env.CACHE_TTL || "300000";

  export function getCacheTTL() {
    try {
      return parseInt(TTL);
    } catch (error) {
      throw new NFTError("Invalid cache TTL", ErrorCode.INVALID_DATA);
    }
  }
  export async function getContract(
    filename: string,
    ext: ContractFileType
  ): Promise<string> {
    const s3 = new S3({ signatureVersion: "v4" });

    const params = {
      Bucket: LICENSE_MANAGMENT_SYSTEM_CONTRACTS_BUCKET,
      Key: `contracts/${filename}/${filename}.${ext}`,
    };

    try {
      const data = await s3.getObject(params).promise();

      if (!data.Body) {
        throw new NFTError("No such contract", ErrorCode.INVALID_CONTRACT);
      }
      return data.Body as string;
    } catch (e) {
      console.error(
        `Error occurred while querying contracts from S3 bucket`,
        e
      );
      throw new NFTError(
        "Cannot access contract",
        ErrorCode.CONTRACT_INACCESSIBLE
      );
    }
  }

  export async function listContracts() {
    const s3 = new S3({ signatureVersion: "v4" });

    const params = {
      Bucket: LICENSE_MANAGMENT_SYSTEM_CONTRACTS_BUCKET,
      Prefix: "/contracts/",
      Delimeter: `/`,
    };

    try {
      const data = await s3.listObjectsV2(params).promise();
      if (!data.Contents) return [];

      const contractList = [];

      for (let contract of data.Contents) {
        contractList.push(contract.Key);
      }
      return contractList;
    } catch (e) {
      console.error(`Error occurred while listing contracts from S3 bucket`, e);
      throw new NFTError(
        "Cannot access contracts",
        ErrorCode.CONTRACT_INACCESSIBLE
      );
    }
  }
}
