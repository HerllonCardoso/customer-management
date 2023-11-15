
export class HttpError extends Error {
  constructor(public statusCode: number, body: Record<string, unknown> = {}) {
    super(JSON.stringify(body));
  }
}

export const handleError = (e: any, headers: any, message: string, status?: number) => {
  if (e) {
    return {
      statusCode: status || 400,
      headers,
      body: JSON.stringify({
        errors: e.errors,
        message,
      }),
    };
  }

  if (e instanceof SyntaxError) {
    return {
      statusCode: status || 400,
      headers,
      body: JSON.stringify({
        error: `invalid request body format : "${e.message}"`,
        message,
      }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: status || e.statusCode,
      headers,
      body: e.message,
    };
  }

  return {
    statusCode: status || e.statusCode,
    headers,
    body: JSON.stringify({
      error: e.error,
      message,
    }),
  };
};
