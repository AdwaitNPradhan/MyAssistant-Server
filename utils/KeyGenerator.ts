import rs from "randomstring";
const GenKeyForLength = (length: number, options?: object) => {
  return rs.generate({ ...options, length: length });
};

export { GenKeyForLength };
