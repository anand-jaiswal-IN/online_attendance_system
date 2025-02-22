export class ApiResponse {
  public static success<T>(
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ) {
    return {
      status: "success",
      statusCode,
      message,
      data,
    };
  }

  public static error(
    message: string,
    statusCode: number = 500,
    errors: any = null
  ) {
    return {
      status: "error",
      statusCode,
      message,
      errors,
    };
  }
}
