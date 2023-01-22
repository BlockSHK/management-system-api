import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiUtil } from "../../core/apiUtil";
import { apiOutput, apiInput } from "../../core/model";
import { LicenseAdapter } from "../../adapters/license";
import { request, ValidationError } from "../../core/validation";

const RejectCode = apiOutput.RejectCode;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let requestBody: apiInput.LicenseInput;
  let response: any;

  try {
    if (!event.body) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid query, request body is required"
      );
    }

    requestBody = request.parseBody(event);
    response = await LicenseAdapter.create("requestUserId", requestBody);
    return apiUtil.get200(event.headers, response);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiUtil.get200BusinessReject(
        event.headers,
        error.errorCode,
        error.message
      );
    }

    console.error("Error during creating license.", error);
    return apiUtil.get500(
      event.headers,
      `Error during creating license ${error}`
    );
  }
};
