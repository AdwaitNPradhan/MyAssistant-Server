import joi from "joi";

const LoginSchema = joi.object({
  loginId: joi.string().required(),
  password: joi.string().min(8).required() .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\d@$!%*?&])[0-9A-Za-z \d@$#!%*?&]{8,}$/,
    "password"
  ),
});

export default LoginSchema;
