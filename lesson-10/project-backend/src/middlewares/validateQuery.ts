import type { RequestHandler } from "express";
import { z } from "zod";

const validateQuery = <T extends z.ZodType>(
  schema: T,
): RequestHandler<any, any, any, z.output<T>> => {
  return (req, res, next) => {
    const validationResult = schema.safeParse(req.query);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid query",
        details: z.flattenError(validationResult.error).fieldErrors,
      });

      return;
    }

    next();
  };
};

export default validateQuery;
