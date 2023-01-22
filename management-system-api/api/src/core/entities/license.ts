import { internal } from "../model";
import { DBService } from "./dbService";

export class License {
  private static PRIMARY_KEY = "id";
  private static INDEX_KEY = "software";
  private static LICENSE_TABLE_NAME =
    process.env.LICENSE_TABLE_NAME || "blockshk-management-system-license";

  async putLicense(license: internal.License) {
    const newVersion = await DBService.getClient().writeOneToDB(
      License.LICENSE_TABLE_NAME,
      license
    );
    return newVersion;
  }
}
