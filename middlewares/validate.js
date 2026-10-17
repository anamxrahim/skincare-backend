// Validate Request Data

const validate = (schema, source = "body") => (req, res, next) => {
  // Validate Request Data Using Zod
  const result = schema.safeParse(req[source] ?? {});

  // Handle Validation Errors
  if (!result.success) {
    const errors = {};

    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || source;

      if (!errors[field]) errors[field] = issue.message;
    }

    return res.status(400).json({
      status: 0,
      msg: "Validation Error",
      errors,
    });
  }

  req.validated = { ...req.validated, [source]: result.data };

  next();
};

export default validate;