import { Request, Response, NextFunction } from "express";

import { AppError } from "../errors.ts";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error instanceof AppError ? error.status : 500;

  res.status(status).json({
    error: {
      message: error.message,
    },
  });
};

export default errorHandler;
