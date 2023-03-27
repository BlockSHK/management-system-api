var AWS = require("aws-sdk"),
  DDB = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    region: "us-east-1",
  });

const sysConfigTable = "blockshk-management-system-config";

function pushToSysConfig() {
  const configArr = require("../sysConfig.json");
  const params = {
    RequestItems: {
      [sysConfigTable]: configArr,
    },
  };
  return DDB.batchWriteItem(params).promise();
}

(async function seed() {
  console.time("Starting");
  //async 2x speed
  try {
    await Promise.all([pushToSysConfig()]);
  } catch (err) {
    console.log(err);
  }
})();
