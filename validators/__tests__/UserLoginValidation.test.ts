import LoginSchema from "../userLoginValidation";
describe("Testing Login Payload Validation", () => {
  test("Successfull Validation", () => {
    const payload = {
      loginId: "adwiit",
      password: "jnus551156b",
    };
    const validatedPayload = LoginSchema.validate(payload);
    expect(validatedPayload).toEqual({ value: payload });
  });
  test("Failed Validation for password below 8 characters", () => {
    const payload = {
      loginId: "adwiit",
      password: "jn6b",
    };
    const validatedPayload = LoginSchema.validate(payload);
    expect(validatedPayload).not.toEqual(payload);
  });
  test("Failed Validation for password not having alphanumeric values 1", () => {
    const payload = {
      loginId: "adwiit",
      password: "jnaaaaaaaab",
    };
    const validatedPayload = LoginSchema.validate(payload);
    expect(validatedPayload).not.toEqual(payload);
  });
  test("Failed Validation for password not having alphanumeric values 2", () => {
    const payload = {
      loginId: "adwiit",
      password: "23456789",
    };
    const validatedPayload = LoginSchema.validate(payload);
    expect(validatedPayload).not.toEqual(payload);
  });
  test("Failed Validation for password not having loginId", () => {
    const payload = {
      loginId: "",
      password: "jnaaaaaaaab",
    };
    const validatedPayload = LoginSchema.validate(payload);
    expect(validatedPayload).not.toEqual(payload);
  });
  test("Failed Validation for password not having password", () => {
    const payload = {
      loginId: "jnaaaaaaaab",
      password: "",
    };
    const validatedPayload = LoginSchema.validate(payload);
    expect(validatedPayload).not.toEqual(payload);
  });
});
