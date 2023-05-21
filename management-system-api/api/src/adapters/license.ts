import { LicenseTypes } from "./../core/model";
import { License } from "./../core/entities/license";
import { apiInput, ErrorCode, internal, LicenseStatus } from "../core/model";
import { ValidationError } from "../core/validation";
import { uuid } from "uuidv4";
import { BlockChain } from "../core/blockchain/blockchain";
import { SysConfig } from "../core/entities/systemConfig";
export namespace LicenseAdapter {
  export async function search(licenseQuery: apiInput.LicenseQuery) {
    let dyResponse;

    const licenseHandler = new License();
    const indexKeys = licenseHandler.getIndexKeys();

    if (licenseQuery.filter) {
      const keys = Object.keys(licenseQuery.filter);
      if (keys.length == 1 && indexKeys.includes(keys[0])) {
        dyResponse = await licenseHandler.queryLicense(licenseQuery);
      } else {
        dyResponse = await licenseHandler.scanLicense(licenseQuery);
      }
    } else {
      dyResponse = await licenseHandler.scanLicense(licenseQuery);
    }

    return {
      count: dyResponse.Count,
      offset: dyResponse.LastEvaluatedKey,
      limit: licenseQuery.limit!,
      records: dyResponse.Items,
    };
  }

  export async function create(licenseInput: apiInput.LicenseInput) {
    const licenseId = uuid();

    const license: internal.License = {
      id: licenseId,
      ...licenseInput,
      status: LicenseStatus.ACTIVE,
    };

    const licenseHandler = new License();
    return await licenseHandler.putLicense(license);
  }
  export async function deploy(
    licenseId: string,
    licenseInput: apiInput.LicenseUpdate
  ) {
    const license: internal.License = {
      id: licenseId,
      ...licenseInput,
    };

    const licenseHandler = new License();
    const latestVersion: internal.License | null =
      await licenseHandler.getLicenseById(licenseId);

    if (!latestVersion) {
      throw new ValidationError("Invalid license.", ErrorCode.INVALID_LICENSE);
    }
    if (latestVersion.owner != license.owner) {
      throw new ValidationError(
        "User is not permitted to update this license",
        ErrorCode.UNAUTHORIZED
      );
    }
    if (latestVersion.contract != null) {
      throw new ValidationError(
        "License contract is already deployed",
        ErrorCode.ALREADY_DEPLOYED
      );
    }
    const blockchain = BlockChain.connect(license.contract!.blockchain);
    let contractName;
    let parameters: any[] = [];

    if (license.type == LicenseTypes.CONTRACT_PERPETUAL) {
      contractName = "PerpetualLicense";
      parameters = [
        license.company!,
        license.name,
        license.metadata,
        license.price,
        "1",
      ];
    } else if (license.type == LicenseTypes.CONTRACT_FIXED_SUBSCRIPTION) {
      contractName = "FixedSubscription";
      parameters = [
        license.company!,
        license.name,
        license.metadata,
        license.price,
        license.subscriptionPeriod!,
      ];
    } else if (license.type == LicenseTypes.CONTRACT_AUTO_RENEW_SUBSCRIPTION) {
      contractName = "AutoRenewTokenSubscriptionLicense";
      parameters = [
        license.company!,
        license.name,
        license.metadata,
        license.paymentToken!,
        license.price,
        license.subscriptionPeriod!,
        "1",
      ];
    } else {
      throw new ValidationError(
        "Invalid license type",
        ErrorCode.INVALID_LICENSE
      );
    }

    const adminPrivateKey = await SysConfig.getSysConfigStr(
      "Admin_Private_key"
    );
    const address = await blockchain.deployContract(
      contractName,
      adminPrivateKey, //account 5
      parameters
    );

    license.contract!.address = address;
    return await licenseHandler.putLicense(license);
  }

  export async function purchase(
    requestUserId: string,
    licenseId: string,
    licensePurchaseInput: apiInput.LicensePurchaseInput
  ) {
    const licenseHandler = new License();
    const latestVersion: internal.License | null =
      await licenseHandler.getLicenseById(licenseId);

    if (!latestVersion) {
      throw new ValidationError("Invalid license.", ErrorCode.INVALID_LICENSE);
    }

    const license = latestVersion as internal.License;
    const contractName = license.contract!.name;
    const contractAddress = license.contract!.address!;

    //TODO : validate required fields
    const blockchain = BlockChain.connect(license.contract!.blockchain);
    //TODO : remove hardcoded values
    const address = await blockchain.mintToken(
      contractName,
      "43a060fe31e2999f873a259d1734194d4006f3e6ca5fee56d20118b9138e6638",
      contractAddress,
      licensePurchaseInput.address
    );
    license.type = LicenseTypes.CONTRACT_PERPETUAL;
    license.token = { contract: contractAddress };
    license.owner = licensePurchaseInput.address;
    license.id = uuid();
    return await licenseHandler.putLicense(license);
  }
}
