import {
  apiInput,
  apiOutput,
  ErrorCode,
  internal,
  Blockchain,
} from "../core/model";
import { uuid } from "uuidv4";
import crypto from "crypto";
import { Activation } from "../core/entities/activation";
import { ValidationError } from "../core/validation";
import { BlockChain } from "../core/blockchain/blockchain";
export namespace ActivationAdapter {
  const nonceValidityDuration = 600000;

  export async function requestNonce(
    address: string
  ): Promise<apiOutput.NonceResponse> {
    let nonce = crypto.randomBytes(16).toString("hex");

    let timestamp = Date.now();
    const session = {
      nonce: nonce,
      address: address,
      timestamp: timestamp,
    };

    const activationHandler = new Activation();
    const dyResponse = await activationHandler.addSession(session);

    return dyResponse;
  }

  export async function activateLicense(
    req: apiInput.ActivationVerificationRequest
  ): Promise<apiOutput.ActivationVerificationResponse> {
    let session, dyResponse, user;

    try {
      const activationHandler = new Activation();
      dyResponse = await activationHandler.getSession(req.nonce);
      if (dyResponse) {
        session = dyResponse;
      } else {
        console.error("Session not found for nonce: ", req.nonce);
        throw new ValidationError(
          "Activation failed, token not found",
          ErrorCode.ACTIVATION_FAILED
        );
      }
      console.log(dyResponse);
      console.log(session);
      // Reject if nonce is generated before 60s
      let timestamp = Date.now();
      if (timestamp - session.timestamp > nonceValidityDuration) {
        console.error("Session expired");
        throw new ValidationError(
          "Activation failed, token expired",
          ErrorCode.ACTIVATION_FAILED
        );
      }

      // Removing session from the DB
      dyResponse = await activationHandler.deleteSession(req.nonce);
      if (!dyResponse) {
        console.error("Session already deleted. Nonce: ", req.nonce);
        throw new ValidationError(
          "Token already Activated.",
          ErrorCode.ACTIVATION_FAILED
        );
      }

      // Verify sign
      let sigValidated: boolean = await BlockChain.connect().validateSig(
        session.address,
        req.sign,
        session.nonce
      );
      if (sigValidated) {
        console.debug("User session authenticated, address: ", session.address);
      } else {
        console.debug(
          "Activation failed because signature validation failed, address: ",
          session.address
        );
        throw new ValidationError(
          "Activation failed, invalid address",
          ErrorCode.ACTIVATION_FAILED
        );
      }
      const blockchain = BlockChain.connect(Blockchain.ETHEREUM);
      const owner = await blockchain.getTokenOwner(req.contract, req.tokenId);
      const expireTime = await blockchain.getTokenExpireTime(
        req.contract,
        req.tokenId
      );
      timestamp = Date.now();

      let response = {
        activate: "false",
        timestamp: timestamp,
        credential: { expireTime: expireTime },
      };

      if (owner.toLowerCase() == req.address.toLowerCase()) {
        response.activate = "true";
      }

      return response;
    } catch (error) {
      console.log(` Error while verifying user ${error} `);
      throw error;
    }
  }
}
