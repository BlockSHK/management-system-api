import { LicenseTypes, apiInput, apiOutput } from "../../core/model";
import { apiUtil } from "../../core/apiUtil";
import { request, ValidationError } from "../../core/validation";
import { LicenseAdapter } from "../../adapters/license";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const RejectCode = apiOutput.RejectCode;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let requestBody: apiInput.LicenseQuery;
  let response: apiOutput.QueryResponse;

  try {
    if (!event.body) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid query, request body is required"
      );
    }

    requestBody = request.parseBody(event);
    console.log("Request body", JSON.stringify(requestBody));

    response = await LicenseAdapter.search(requestBody);
    console.log("Response : ", JSON.stringify(response));
    return apiUtil.get200(event.headers, response);
  } catch (error) {
    console.error("Error during querying license.", error);
    if (error instanceof ValidationError) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        error.message
      );
    }
    return apiUtil.get500(
      event.headers,
      `Error during querying license ${error}`
    );
  }
};
