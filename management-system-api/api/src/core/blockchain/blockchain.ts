import { Activation } from "./../entities/activation";
import Web3 from "web3";
import { Account } from "web3-core";
import Common from "@ethereumjs/common";
import { Transaction, TxOptions } from "@ethereumjs/tx";
import { ValidationError } from "../validation";
import { Blockchain, ContractFileType, ErrorCode } from "../model";
import { util } from "../util";
import { NFTError } from "../../core/error";
import { SysConfig } from "../../core/entities/systemConfig";
export class BlockChain {
  private web3: Web3;
  private static blockChain: BlockChain;
  private nodeUrl: string | undefined;
  private chain: Blockchain | undefined;

  private constructor(blockchain?: Blockchain) {
    try {
      this.chain = blockchain;
      switch (blockchain) {
        case Blockchain.ETHEREUM:
          this.nodeUrl =
            "https://eth-sepolia.g.alchemy.com/v2/by1trNTlFI3duvE9djbUXgTfE9O6QPed";
          this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeUrl));
          break;
        case Blockchain.POLYGON:
        case Blockchain.BSC:
          this.nodeUrl =
            "https://eth-sepolia.g.alchemy.com/v2/by1trNTlFI3duvE9djbUXgTfE9O6QPed";
          break;
        default:
          this.nodeUrl =
            "https://eth-sepolia.g.alchemy.com/v2/by1trNTlFI3duvE9djbUXgTfE9O6QPed";
          this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeUrl));
          return;
      }
      this.nodeUrl =
        "https://eth-sepolia.g.alchemy.com/v2/by1trNTlFI3duvE9djbUXgTfE9O6QPed";
      this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeUrl));
    } catch (e) {
      throw new ValidationError(`blockchain not connected ${e}`);
    }
  }

  public static connect(blockchain?: Blockchain) {
    if (!BlockChain.blockChain) {
      this.blockChain = new BlockChain(blockchain);
    }
    return this.blockChain;
  }

  private getAccount(privateKey: string): Account {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }

  private getChain(): string {
    switch (this.chain) {
      case Blockchain.ETHEREUM:
      case Blockchain.POLYGON:
      case Blockchain.BSC:
        return "ropsten";
      default:
        throw new ValidationError(`Invalid chain or no chain : ${this.chain}`);
    }
  }

  public async deployContract(
    contractName: string,
    privateKey: string,
    properties: any[]
  ): Promise<string> {
    try {
      const bycode = (
        await util.getContract(contractName, ContractFileType.BIN)
      ).toString();
      const abi = (
        await util.getContract(contractName, ContractFileType.ABI)
      ).toString();

      let ActivationContractAddress = "";
      if (contractName == "PerpetualLicense") {
        ActivationContractAddress = await this.deployActivationContract(
          privateKey
        );
        properties.push(ActivationContractAddress);
      }
      const account = this.getAccount(privateKey);
      const key = Buffer.from(privateKey, "hex");

      const gasPrice = await SysConfig.getSysConfigNum("gas_price");
      const gasLimit = await SysConfig.getSysConfigNum("gas_limit");
      let gasPriceHex = this.web3.utils.toHex(gasPrice);
      let gasLimitHex = this.web3.utils.toHex(gasLimit);
      let nonce = await this.web3.eth.getTransactionCount(account.address);

      let nonceHex = this.web3.utils.toHex(nonce);
      const contract = new this.web3.eth.Contract(JSON.parse(abi));
      const options = { data: bycode, arguments: properties };
      const transaction = contract.deploy(options);

      let rawTx = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data: transaction.encodeABI(),
        from: account.address,
      };
      const sepoliaCommon = Common.custom({
        name: "sepolia",
        chainId: 11155111,
        networkId: 11155111, // replace with the correct hardfork
      });

      let txoption: TxOptions = {
        common: sepoliaCommon,
      };

      let tx = new Transaction(rawTx, txoption);
      let signed: Transaction = tx.sign(key);
      let serializedTx = signed.serialize();
      let response = await this.web3.eth.sendSignedTransaction(
        "0x" + serializedTx.toString("hex")
      );
      let contractAddress = response.contractAddress!;
      console.log("In the deploy contractAddress Perpetual", contractAddress);
      console.log(
        "In the deploy contractAddress Activation",
        ActivationContractAddress
      );
      if (contractName == "PerpetualLicense") {
        let response = await this.updateActivationContract(
          ActivationContractAddress,
          contractAddress,
          privateKey
        );
      }
      return contractAddress;
    } catch (error) {
      if (!(error instanceof NFTError)) {
        console.error("Error occurred while deploying contract", error);
        throw new NFTError(
          "Error occurred while deploying contract",
          ErrorCode.WEB3_ERROR
        );
      }
      throw error;
    }
  }

  public async mintToken(
    contractName: string,
    privateKey: string,
    contractAddress: string,
    traderAddress: string
  ): Promise<string> {
    try {
      const abi = await util.getContract(contractName, ContractFileType.ABI);

      const account = this.getAccount(privateKey);
      const key = Buffer.from(privateKey, "hex");

      const gasPrice = await SysConfig.getSysConfigNum("gas_price");
      const gasLimit = await SysConfig.getSysConfigNum("gas_limit");
      let gasPriceHex = this.web3.utils.toHex(gasPrice);
      let gasLimitHex = this.web3.utils.toHex(gasLimit);
      let nonce = await this.web3.eth.getTransactionCount(account.address);

      let contract = new this.web3.eth.Contract(
        JSON.parse(abi),
        contractAddress
      );
      let methodEncode = contract.methods.mintToken(traderAddress).encodeABI();

      let nonceHex = this.web3.utils.toHex(nonce);
      let rawTx = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data: methodEncode,
        to: contractAddress,
      };

      const sepoliaCommon = Common.custom({
        name: "sepolia",
        chainId: 11155111,
        networkId: 11155111, // replace with the correct hardfork
      });

      let txoption: TxOptions = {
        common: sepoliaCommon,
      };
      let tx = new Transaction(rawTx, txoption);

      let signed: Transaction = tx.sign(key);

      let serializedTx = signed.serialize();

      let response = await this.web3.eth.sendSignedTransaction(
        "0x" + serializedTx.toString("hex")
      );

      console.log(response.transactionHash);
      return response.transactionHash;
    } catch (error) {
      if (!(error instanceof NFTError)) {
        console.error("Error occurred while deploying contract", error);
        throw new NFTError(
          "Error occurred while deploying contract",
          ErrorCode.WEB3_ERROR
        );
      }
      throw error;
    }
  }

  public async validateSig(address: string, signature: string, nonce: string) {
    const hash = this.web3.utils.sha3(nonce);
    const signing_address = this.web3.eth.accounts.recover(hash!, signature);
    console.log(signing_address);
    return signing_address.toLowerCase() === address.toLowerCase();
  }

  public async updateActivationContract(
    ActivationContractAddress: string,
    LicenseContractAddress: string,
    privateKey: string
  ) {
    try {
      console.log(
        "updateActivation Contract ActivationContractAddress",
        ActivationContractAddress
      );
      console.log(
        "updateActivation Contract LicenseContractAddress",
        LicenseContractAddress
      );
      const abi = await util.getContract(
        "LicenseActivation",
        ContractFileType.ABI
      );

      const account = this.getAccount(privateKey);
      const key = Buffer.from(privateKey, "hex");

      const gasPrice = await SysConfig.getSysConfigNum("gas_price");
      const gasLimit = await SysConfig.getSysConfigNum("gas_limit");
      let gasPriceHex = this.web3.utils.toHex(gasPrice);
      let gasLimitHex = this.web3.utils.toHex(gasLimit);
      let nonce = await this.web3.eth.getTransactionCount(account.address);

      let contract = new this.web3.eth.Contract(
        JSON.parse(abi),
        ActivationContractAddress
      );
      let methodEncode = contract.methods
        .initialize(LicenseContractAddress)
        .encodeABI();

      let nonceHex = this.web3.utils.toHex(nonce);
      let rawTx = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data: methodEncode,
        to: ActivationContractAddress,
      };

      const sepoliaCommon = Common.custom({
        name: "sepolia",
        chainId: 11155111,
        networkId: 11155111, // replace with the correct hardfork
      });

      let txoption: TxOptions = {
        common: sepoliaCommon,
      };
      let tx = new Transaction(rawTx, txoption);

      let signed: Transaction = tx.sign(key);

      let serializedTx = signed.serialize();

      let response = await this.web3.eth.sendSignedTransaction(
        "0x" + serializedTx.toString("hex")
      );

      console.log(response.transactionHash);
      return response.transactionHash;
    } catch (error) {
      if (!(error instanceof NFTError)) {
        console.error(
          "Error occurred while updating activation contract",
          error
        );
        throw new NFTError(
          "Error occurred while updating activation contract",
          ErrorCode.WEB3_ERROR
        );
      }
      throw error;
    }
  }

  public async deployActivationContract(privateKey: string) {
    const bycode = (
      await util.getContract("LicenseActivation", ContractFileType.BIN)
    ).toString();
    const abi = (
      await util.getContract("LicenseActivation", ContractFileType.ABI)
    ).toString();

    const account = this.getAccount(privateKey);
    const key = Buffer.from(privateKey, "hex");

    const gasPrice = await SysConfig.getSysConfigNum("gas_price");
    const gasLimit = await SysConfig.getSysConfigNum("gas_limit");
    let gasPriceHex = this.web3.utils.toHex(gasPrice);
    let gasLimitHex = this.web3.utils.toHex(gasLimit);
    let nonce = await this.web3.eth.getTransactionCount(account.address);

    let nonceHex = this.web3.utils.toHex(nonce);
    const contract = new this.web3.eth.Contract(JSON.parse(abi));
    const options = { data: bycode, arguments: [] };
    const transaction = contract.deploy(options);

    let rawTx = {
      nonce: nonceHex,
      gasPrice: gasPriceHex,
      gasLimit: gasLimitHex,
      data: transaction.encodeABI(),
      from: account.address,
    };

    const sepoliaCommon = Common.custom({
      name: "sepolia",
      chainId: 11155111,
      networkId: 11155111, // replace with the correct hardfork
    });

    let txoption: TxOptions = {
      common: sepoliaCommon,
    };

    let tx = new Transaction(rawTx, txoption);
    let signed: Transaction = tx.sign(key);
    let serializedTx = signed.serialize();
    let response = await this.web3.eth.sendSignedTransaction(
      "0x" + serializedTx.toString("hex")
    );
    let contractAddress = response.contractAddress!;
    console.log("In the deploy ActivationContractAddress", contractAddress);
    return contractAddress;
  }
  public async getTokenOwner(
    contractAddress: string,
    tokenId: string
  ): Promise<string> {
    const abi = (
      await util.getContract("PerpetualLicense", ContractFileType.ABI)
    ).toString();
    const contract = new this.web3.eth.Contract(
      JSON.parse(abi),
      contractAddress
    );
    return await contract.methods.ownerOf(tokenId).call();
  }
  public getweb3() {
    console.log(this.web3.givenProvider);
    return this.web3;
  }
}
