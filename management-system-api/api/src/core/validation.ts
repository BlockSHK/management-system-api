import { ErrorCode } from "./model";

export namespace request {
  export function parseBody(event: any): any {
    let requestBody: any;
    if (typeof event.body == "string") {
      try {
        requestBody = JSON.parse(event.body);
      } catch (e) {
        console.error(`Unparsable request body ${e}`);
        throw new ValidationError(`Unparsable JSON in request body`);
      }
    } else {
      requestBody = event.body;
    }
    return requestBody;
  }
}

export class ValidationError extends Error {
  constructor(
    readonly message: string,
    readonly errorCode: string = ErrorCode.INVALID_DATA
  ) {
    super(message);
  }
}
