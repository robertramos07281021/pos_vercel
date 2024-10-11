import Joi from "joi";

const UserSchemaValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.ref("password"),
});

export { UserSchemaValidation };
