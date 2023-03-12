import { License } from "./../core/entities/license";
import { apiInput, ErrorCode, internal, LicenseStatus } from "../core/model";
import { ValidationError } from "../core/validation";
import { uuid } from "uuidv4";
import { BlockChain } from "../core/blockchain/blockchain";
export namespace LicenseAdapter {
  export async function create(
    requestUserId: string,
    licenseInput: apiInput.LicenseInput
  ) {
    const licenseId = uuid();

    const license: internal.License = {
      id: licenseId,
      ...licenseInput,
      status: LicenseStatus.ACTIVE,
      owner: requestUserId,
    };

    const licenseHandler = new License();
    return await licenseHandler.putLicense(license);
  }
  export async function deploy(
    requestUserId: string,
    licenseId: string,
    licenseInput: apiInput.LicenseUpdate
  ) {
    const license: internal.License = {
      id: licenseId,
      ...licenseInput,
      owner: requestUserId,
    };

    const licenseHandler = new License();
    const latestVersion: internal.License | null =
      await licenseHandler.getAssetById(licenseId);

    if (!latestVersion) {
      throw new ValidationError("Invalid license.", ErrorCode.INVALID_LICENSE);
    }
    if (latestVersion.owner != requestUserId) {
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

    const address = await blockchain.deployContract(
      license.contract!.name,
      "43a060fe31e2999f873a259d1734194d4006f3e6ca5fee56d20118b9138e6638", //account 5
      [license.company!, license.name, license.price, "1"]
    );

    license.contract!.address = address;
    return await licenseHandler.putLicense(license);
  }
}
