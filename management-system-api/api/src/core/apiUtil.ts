import { APIGatewayProxyEventHeaders, APIGatewayProxyResult } from "aws-lambda";

export namespace apiUtil {
  export function getCorsHeaders(incomingHeaders: APIGatewayProxyEventHeaders) {
    if (incomingHeaders == null) {
      incomingHeaders = {};
    }

    const lcHeaders = Object.keys(incomingHeaders).reduce((keys: any, k) => {
      keys[k.toLowerCase()] = incomingHeaders[k];
      return keys;
    }, {});

    return {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": lcHeaders["origin"],
      "Access-Control-Allow-Methods":
        lcHeaders["access-control-request-method"]!,
      "Content-Type": "application/json",
    };
  }

  export function get200(
    headers: APIGatewayProxyEventHeaders,
    payload: any = { message: "success" }
  ): APIGatewayProxyResult {
    return {
      headers: apiUtil.getCorsHeaders(headers),
      statusCode: 200,
      body: JSON.stringify({
        status: "OK",
        payload,
      }),
    };
  }

  export function get202(requestId: string): APIGatewayProxyResult {
    return {
      statusCode: 202,
      body: JSON.stringify({ requestId, status: "OK" }),
    };
  }

  export function get200BusinessReject(
    headers: APIGatewayProxyEventHeaders,
    rejectCode: string,
    rejectReason: string
  ): APIGatewayProxyResult {
    return {
      headers: apiUtil.getCorsHeaders(headers),
      statusCode: 200,
      body: JSON.stringify({
        status: "REJECTED",
        error: {
          rejectCode,
          rejectReason: rejectReason,
        },
      }),
    };
  }

  // for unauthorized rejects - message shown to user
  export function get400(
    headers: APIGatewayProxyEventHeaders,
    rejectCode: string,
    rejectReason: string
  ): APIGatewayProxyResult {
    return {
      headers: apiUtil.getCorsHeaders(headers),
      statusCode: 400,
      body: JSON.stringify({
        status: "REJECTED",
        error: {
          rejectCode,
          rejectReason: rejectReason,
        },
      }),
    };
  }

  // for unsupported rejects (Forbidden) - message show to user
  export function get403(
    headers: APIGatewayProxyEventHeaders,
    rejectCode: string,
    rejectReason: string
  ): APIGatewayProxyResult {
    return {
      headers: apiUtil.getCorsHeaders(headers),
      statusCode: 403,
      body: JSON.stringify({
        status: "REJECTED",
        error: {
          rejectCode,
          rejectReason: rejectReason,
        },
      }),
    };
  }

  // for internal errors - message not shown to user
  export function get500(
    headers: APIGatewayProxyEventHeaders,
    rejectReason: string
  ): APIGatewayProxyResult {
    return {
      headers: apiUtil.getCorsHeaders(headers),
      statusCode: 500,
      body: JSON.stringify({
        message: rejectReason,
      }),
    };
  }

  export function strToHex(str: string) {
    return str
      .split("")
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  }
}
