import { Base64 } from "../src/index";

describe("Base64", () => {
  describe("bytesToBase64", () => {
    it("converts bytes to base64", () => {
      const input = new Uint8Array([
        72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
      ]);
      const expectedOutput = "SGVsbG8gV29ybGQ=";
      const result = Base64.bytesToBase64(input);
      expect(result).toEqual(expectedOutput);
    });

    it("converts an empty array to an empty string", () => {
      const input = new Uint8Array([]);
      const expectedOutput = "";
      const result = Base64.bytesToBase64(input);
      expect(result).toEqual(expectedOutput);
    });

    it("converts a large array of bytes to base64", () => {
      const input = new Uint8Array([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);
      const expectedOutput = "AAECAwQFBgcICQoLDA0ODw==";
      const result = Base64.bytesToBase64(input);
      expect(result).toEqual(expectedOutput);
    });
  });

  describe("base64ToBytes", () => {
    it("converts base64 to bytes", () => {
      const input = "SGVsbG8gV29ybGQ=";
      const expectedOutput = new Uint8Array([
        72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
      ]);
      const result = Base64.base64ToBytes(input);
      expect(result).toEqual(expectedOutput);
    });

    it("throws an error if the input is not a valid base64 string", () => {
      const input = "hello";
      expect(() => Base64.base64ToBytes(input)).toThrow(Error);
    });

    it("converts an empty string to an empty array", () => {
      const input = "";
      const expectedOutput = new Uint8Array([]);
      const result = Base64.base64ToBytes(input);
      expect(result).toEqual(expectedOutput);
    });

    it("converts a large base64 string to bytes", () => {
      const input = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=";
      const expectedOutput = new Uint8Array([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ]);
      const result = Base64.base64ToBytes(input);
      expect(result).toEqual(expectedOutput);
    });

    it("throws an error if the input is not a valid base64 string", () => {
      const input = "hello";
      expect(() => Base64.base64ToBytes(input)).toThrow(Error);
    });
  });
});
