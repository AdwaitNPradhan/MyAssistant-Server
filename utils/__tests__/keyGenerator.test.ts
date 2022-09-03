import { GenKeyForLength } from "../KeyGenerator";

describe("Testing Utility Fuctions", () => {
  test("should generate random string of length 19", () => {
    const string = GenKeyForLength(19);
    expect(string.length).toBe(19);
  });
});
