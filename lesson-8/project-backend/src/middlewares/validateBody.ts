import type { RequestHandler } from "express";
import { z } from "zod";

const validateBody = <T extends z.ZodType>(
  schema: T,
): RequestHandler<any, any, z.output<T>> => {
  return (req, res, next) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Invalid data",
        details: z.flattenError(validationResult.error).fieldErrors,
      });

      return;
    }

    req.body = validationResult.data;
    next();
  };
};

export default validateBody;
