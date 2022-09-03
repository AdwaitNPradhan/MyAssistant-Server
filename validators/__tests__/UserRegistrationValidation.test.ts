import { GenKeyForLength } from "../../utils/KeyGenerator";
import RegisterSchema from "../userRegistrationValidation";

describe("Testing Registration Payload Validation", () => {
  test("Successful Validation", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: "test" + GenKeyForLength(4),
      password: GenKeyForLength(14),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.com",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).toEqual({ value: payload });
  });
  test("Failed Validation for missing fields", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: "test" + GenKeyForLength(4),
      password: null,
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.com",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for wrong email format", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: "test" + GenKeyForLength(4),
      password: null,
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for password length < 8", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: "test" + GenKeyForLength(4),
      password: GenKeyForLength(4),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for username length < 8", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: GenKeyForLength(4),
      password: GenKeyForLength(18),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for username length > 16", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: GenKeyForLength(24),
      password: GenKeyForLength(18),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for username alphabets only", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: GenKeyForLength(24, { charset: "alphabetic" }),
      password: GenKeyForLength(18),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for username numbers only", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: GenKeyForLength(24, { charset: "numeric" }),
      password: GenKeyForLength(18),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for username with special characters", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: GenKeyForLength(24, { charset: "asgas5236266#%@%#^$^&" }),
      password: GenKeyForLength(18),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for password alphabets only", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: GenKeyForLength(24),
      password: GenKeyForLength(18, { charset: "alphabetic" }),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Failed Validation for password numbers only", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: GenKeyForLength(24),
      password: GenKeyForLength(18, { charset: "numeric" }),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).not.toEqual({ value: payload });
  });
  test("Successful Validation for password with special characters", () => {
    const payload = {
      name: "Test-" + GenKeyForLength(3),
      userName: GenKeyForLength(14),
      password: GenKeyForLength(18, {
        charset: "asAGASGDBgas5236266#%@%#$&",
      }),
      email:
        "test" +
        GenKeyForLength(8, { capitalization: "lowercase" }) +
        "@gmail.io",
    };
    const validatedPayload = RegisterSchema.validate(payload);
    expect(validatedPayload).toEqual({ value: payload });
  });
});
