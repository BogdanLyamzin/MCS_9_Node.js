import { Request, Response, NextFunction } from "express";

import { NotFoundError, ValidationError } from "../errors";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status =
    error instanceof NotFoundError || error instanceof ValidationError
      ? error.status
      : 500;
  res.status(status).json({
    error: {
      message: error.message,
    },
  });
};

export default errorHandler;
