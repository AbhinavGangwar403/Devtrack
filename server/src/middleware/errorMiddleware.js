// Central API error handling.

const notFound = (
  req,
  res,
  next
) => {
  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};

const errorHandler = (
  err,
  req,
  res,
  next
) => {
let statusCode =
    res.statusCode >= 400
      ? res.statusCode
      : 500;

  let message =
    err.message ||
    "Internal server error";

  if (
    err.name ===
    "ValidationError"
  ) {
    statusCode = 400;

    message =
      Object.values(
        err.errors
      )
        .map(
          (error) =>
            error.message
        )
        .join(", ");
  }

  if (
    err.name ===
    "CastError"
  ) {
    statusCode = 400;
    message =
      "Invalid ID format";
  }

  if (
    err.code === 11000
  ) {
    statusCode = 409;
    message =
      "A record with this value already exists";
  }

  res.status(statusCode).json({
    message,

    ...(process.env.NODE_ENV ===
      "development" && {
      stack: err.stack,
    }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};