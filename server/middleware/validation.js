import { UserSchemaValidation } from "../middleware/joi.js";

const validateCreateUser = (req, res, next) => {
  const { error } = UserSchemaValidation.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return res.status(400).json(msg);
  } else {
    next();
  }
};

export { validateCreateUser };
