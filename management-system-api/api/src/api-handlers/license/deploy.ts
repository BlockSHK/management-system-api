import { LicenseTypes, RejectCode } from "../../core/model";
import { apiUtil } from "../../core/apiUtil";
import { request, ValidationError } from "../../core/validation";
import { LicenseAdapter } from "../../adapters/license";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let requestBody: any;
  let response: any;
  let assetId: string;
  try {
    if (!event.body) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid query, request body is required"
      );
    }

    if (event.pathParameters == null || event.pathParameters.id == null) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        "Invalid payload, license id is required"
      );
    }

    assetId = event.pathParameters.id!;
    requestBody = request.parseBody(event);

    response = await LicenseAdapter.deploy();
    return apiUtil.get200(event.headers, response);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiUtil.get200BusinessReject(
        event.headers,
        RejectCode.VALIDATION_ERROR,
        error.message
      );
    }

    console.error("Error during deploying asset.", error);
    return apiUtil.get500(
      event.headers,
      `Error during deploying asset ${error}`
    );
  }
};
