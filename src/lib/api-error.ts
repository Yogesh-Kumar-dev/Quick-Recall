// Thrown from inside a route handler wrapped by withApiHandler to produce a specific status
// code + client-safe message instead of the generic 500 an uncaught error would fall through to.
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
