export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, "BAD_REQUEST", message, details);
  }

  static unauthorized(message = "No autenticado") {
    return new ApiError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "No tienes permiso para esta acción") {
    return new ApiError(403, "FORBIDDEN", message);
  }

  static notFound(message = "Recurso no encontrado") {
    return new ApiError(404, "NOT_FOUND", message);
  }

  static conflict(message: string) {
    return new ApiError(409, "CONFLICT", message);
  }

  static subscriptionInactive(subscription: unknown) {
    return new ApiError(402, "SUBSCRIPTION_INACTIVE", "La suscripción del restaurante no está activa", {
      subscription,
    });
  }
}
