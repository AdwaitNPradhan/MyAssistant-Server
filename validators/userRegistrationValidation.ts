import joi from "joi";

const RegisterSchema = joi.object({
  name: joi.string().required(),
  userName: joi.string().alphanum().min(8).max(16).required(),
  password: joi
    .string()
    .min(8)
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\d@$!%*?&])[0-9A-Za-z \d@$#!%*?&]{8,}$/,
      "password"
    ),
  email: joi.string().email({ minDomainSegments: 2 }).required(),
});

export default RegisterSchema;
