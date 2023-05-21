import { internal, apiInput } from "../model";
import { DBService } from "./dbService";

export class License {
  private static PRIMARY_KEY = "id";
  private static INDEX_KEY = "software";
  private static OWNER_INDEX_KEY = "owner";
  private static LICENSE_TABLE_NAME =
    process.env.LICENSE_TABLE_NAME || "blockshk-management-system-license";

  getIndexKeys() {
    return [License.PRIMARY_KEY, License.INDEX_KEY, License.OWNER_INDEX_KEY];
  }
  async putLicense(license: internal.License) {
    const newVersion = await DBService.getClient().writeOneToDB(
      License.LICENSE_TABLE_NAME,
      license
    );
    return newVersion;
  }
  async queryLicense(req: apiInput.LicenseQuery): Promise<any> {
    let indexKey = License.INDEX_KEY;
    let indexValue = req!.filter!.software;

    if (req!.filter!.owner) {
      indexKey = License.OWNER_INDEX_KEY;
      indexValue = req!.filter!.owner;
    }

    return await DBService.getClient().queryTable(
      License.LICENSE_TABLE_NAME,
      req!,
      { partitionKey: License.PRIMARY_KEY },
      indexKey,
      { partitionKey: req!.filter!.id },
      indexValue
    );
  }

  async scanLicense(req: apiInput.LicenseQuery): Promise<any> {
    const filter = [];
    if (req.filter) {
      const keys = Object.keys(req.filter);
      if (keys.length > 0) {
        for (let key of keys) {
          filter.push({
            key,
            value: req.filter[key as keyof apiInput.LicenseQuery["filter"]],
          });
        }
      }
    }
    return await DBService.getClient().scanTable(
      License.LICENSE_TABLE_NAME,
      req!,
      filter
    );
  }
  async getLicenseById(licenseId: string): Promise<internal.License | null> {
    const asset = await DBService.getClient().getOneByPrimaryKey(
      License.LICENSE_TABLE_NAME,
      { id: licenseId }
    );

    return asset;
  }
}
