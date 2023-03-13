import { internal } from "../model";
import { DBService } from "./dbService";

export class Activation {
  private static PRIMARY_KEY = "id";
  private static INDEX_KEY = "software";
  private static ACTIVATION_REQUEST_TABLE_NAME =
    process.env.ACTIVATION_REQUEST_TABLE_NAME ||
    "blockshk-management-system-activation";

  async addSession(session: internal.Session): Promise<internal.Session> {
    return await DBService.getClient().writeOneToDB(
      Activation.ACTIVATION_REQUEST_TABLE_NAME,
      session
    );
  }

  async deleteSession(nonce: string): Promise<internal.Session> {
    return await DBService.getClient().deleteItem(
      Activation.ACTIVATION_REQUEST_TABLE_NAME,
      { nonce }
    );
  }

  async getSession(nonce: string): Promise<any> {
    return await DBService.getClient().getOneByPrimaryKey(
      Activation.ACTIVATION_REQUEST_TABLE_NAME,
      { nonce }
    );
  }
}
