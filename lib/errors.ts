// NestJS의 HttpException 계열을 대체하는 경량 에러.
// Server Action에서 throw하면 react-query의 onError로 전파된다.
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const badRequest = (message = "잘못된 요청입니다.") =>
  new HttpError(400, message);
export const unauthorized = (message = "인증이 필요합니다.") =>
  new HttpError(401, message);
export const forbidden = (message = "권한이 없습니다.") =>
  new HttpError(403, message);
export const notFound = (message = "찾을 수 없습니다.") =>
  new HttpError(404, message);
export const conflictError = (message = "이미 존재합니다.") =>
  new HttpError(409, message);
export const unprocessable = (message = "처리할 수 없는 요청입니다.") =>
  new HttpError(422, message);
export const internal = (message = "서버 오류가 발생했습니다.") =>
  new HttpError(500, message);
