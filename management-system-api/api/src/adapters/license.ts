import { License } from "./../core/entities/license";
import { apiInput, ErrorCode, internal, LicenseStatus } from "../core/model";
import { ValidationError } from "../core/validation";
import { uuid } from "uuidv4";

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
  export async function deploy() {
    const response = "Deployed the license";
    return response;
  }
}
