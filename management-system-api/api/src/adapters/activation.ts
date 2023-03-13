import { apiInput, apiOutput, ErrorCode, internal } from "../core/model";
import { uuid } from "uuidv4";
import crypto from "crypto";
import { Activation } from "core/entities/activation";

export namespace ActivationAdapter {
  const nonceValidityDuration = 60000;

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
}
