import { DBService } from "./dbService";
export namespace SysConfig {
  const CONFIG_TABLE_NAME =
    process.env.SYS_CONFIGS_TABLE_NAME || "blockshk-management-system-config";

  async function getConfig(config_name: string): Promise<any> {
    return await DBService.getClient().getOneByPrimaryKey(CONFIG_TABLE_NAME, {
      config_name,
    });
  }

  export async function getSysConfigStr(name: string): Promise<string> {
    let dyResponse = await getConfig(name);
    if (dyResponse) {
      return dyResponse.value;
    }

    return "";
  }

  export async function getSysConfigList(name: string): Promise<Array<string>> {
    let dyResponse = await getConfig(name);
    console.log(dyResponse);
    console.log("config list");
    if (dyResponse) {
      return dyResponse.value;
    }

    return [];
  }

  export async function getSysConfigNum(name: string): Promise<number> {
    let dyResponse = await getConfig(name);
    if (dyResponse) {
      return parseInt(dyResponse.value);
    }

    return -1;
  }
}
