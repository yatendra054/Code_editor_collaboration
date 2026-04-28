import { ZodError } from "zod";

const trimObjectStrings = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(trimObjectStrings);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    acc[key] =
      typeof value === "string" ? value.trim() : trimObjectStrings(value);
    return acc;
  }, {});
};

const validateRequest = (schema) => async (req, res, next) => {
  try {
    // Trim all string values in req.body
    req.body = trimObjectStrings(req.body);

    // Validate the request body

    await schema.parseAsync(req.body);

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

export default validateRequest;
