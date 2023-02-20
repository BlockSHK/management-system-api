import { apiInput, apiOutput, ErrorCode, internal } from "../core/model";
import { uuid } from "uuidv4";
import crypto from "crypto";

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

    // Write the activation request to database

    return session;
  }
}
