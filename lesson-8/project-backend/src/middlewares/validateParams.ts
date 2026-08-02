import type { RequestHandler } from "express";
import { z } from "zod";

const validateParams = <T extends z.ZodType>(
  schema: T,
): RequestHandler<z.output<T>> => {
  return (req, res, next) => {
    const validationResult = schema.safeParse(req.params);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid params",
        details: z.flattenError(validationResult.error).fieldErrors,
      });

      return;
    }

    req.params = validationResult.data;
    next();
  };
};

export default validateParams;
