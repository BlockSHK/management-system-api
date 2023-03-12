export class NFTError extends Error {
  constructor(readonly message: string, readonly errorCode: string) {
    super(message);
  }
}
