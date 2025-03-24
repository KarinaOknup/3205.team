const validation = schema => async (req, res, next) => {
    try {
      req.ctx.validatedData = schema.parse({ ...req.body, ...req.query, ...req.params });
    } catch (error) {
      return res.status(400).send({ errors: error.issues });
    }
  
    next();
  };

export default validation;