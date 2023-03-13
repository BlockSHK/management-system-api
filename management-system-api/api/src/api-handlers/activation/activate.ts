import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiUtil } from "../../core/apiUtil";
import { apiInput, apiOutput } from "../../core/model";
import { request, ValidationError } from "../../core/validation";
import { ActivationAdapter } from "../../adapters/activation";

const RejectCode = apiOutput.RejectCode;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let requestBody: apiInput.ActivationVerificationRequest;
  let response: apiOutput.ActivationVerificationResponse;

  try {
    if (event.httpMethod !== "POST") {
      return apiUtil.get403(
        event.headers,
        RejectCode.WRONG_REQUEST_TYPE,
        "Required to send a http post request"
      );
    }

    if (!event.body) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid request, request body is required"
      );
    }

    requestBody = request.parseBody(event);
    if (!requestBody.address || requestBody.address === "") {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid request, request body.address is required"
      );
    }
    if (!requestBody.sign) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid request, request body.sign is required"
      );
    }
    if (!requestBody.nonce) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid request, request body.nonce is required"
      );
    }
    if (!requestBody.contract) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid request, request body.contract is required"
      );
    }
    if (!requestBody.tokenId) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid request, request body.tokenId is required"
      );
    }
    response = await ActivationAdapter.activateLicense(requestBody);
    return apiUtil.get200(event.headers, response);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(error.stack?.toString());
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        error.message
      );
    }

    console.error("Error during verifying signed nonce. ", error);
    return apiUtil.get500(event.headers, `Error during activation. ${error}`);
  }
};
