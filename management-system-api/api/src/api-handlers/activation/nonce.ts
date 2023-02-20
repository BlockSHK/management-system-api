import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiUtil } from "../../core/apiUtil";
import { apiInput, apiOutput } from "../../core/model";
import { request, ValidationError } from "../../core/validation";
import { ActivationAdapter } from "../../adapters/activation";

const RejectCode = apiOutput.RejectCode;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let requestBody: apiInput.NonceRequest;
  let response: apiOutput.NonceResponse;

  try {
    if (event.httpMethod !== "POST") {
      // POST is expected here since this function causes side iffects by creating a session in DynamoDB
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

    // Sending response to the FE
    response = await ActivationAdapter.requestNonce(requestBody.address);
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

    console.error("Error during retrieving nonce for activation. ", error);
    return apiUtil.get500(event.headers, `Error during activation. ${error}`);
  }
};
