import { JsonType, NexemajSpec, TokenType } from "../src/nexemaj/spec";
import { NexemajReader } from "../src/nexemaj/reader";

describe("Nexemaj", () => {
  describe("Reader", () => {
    test("Step by step", () => {
      const buffer = new TextEncoder().encode(
        `{"key":    true,"key2" : "string"}`
      );
      const reader = new NexemajReader(buffer);

      expect(reader.whichToken()).toBe(TokenType.OBJECT_START);
      reader.next();
      expect(reader.whichToken()).toBe(TokenType.QUOTE);
      expect(reader.readString()).toBe("key");

      expect(reader.whichToken()).toBe(TokenType.COLON);
      reader.next();

      expect(reader.whichType()).toBe(JsonType.BOOLEAN_TRUE);
      expect(reader.readBoolean()).toStrictEqual(true);

      expect(reader.whichToken()).toBe(TokenType.COMMA);
      reader.next();
      expect(reader.readString()).toBe("key2");
      expect(reader.whichToken()).toBe(TokenType.COLON);
      reader.next();
      expect(reader.whichType()).toBe(JsonType.STRING);
      expect(reader.readString()).toBe("string");
      expect(reader.whichToken()).toBe(TokenType.OBJECT_END);

      reader.next();
      expect(reader.whichToken()).toBe(TokenType.INVALID);
    });

    test("readArray", () => {
      const input = new TextEncoder().encode(`[true, 25,false,11.2221,"hola"]`);
      const reader = new NexemajReader(input);
      expect(reader.readArray()).toStrictEqual([
        true,
        25,
        false,
        11.2221,
        "hola",
      ]);
      expect(reader.whichToken()).toBe(TokenType.INVALID);
    });

    test("readNumber", () => {
      const input = new TextEncoder().encode(`25.4`);
      expect(new NexemajReader(input).readNumber()).toStrictEqual(25.4);
    });

    test("read", () => {
      const input = new TextEncoder().encode(
        `{"key":"hello","key2":25,"key3":23.32,"key4":true,"key5":["hola", 12, true, false],"key6":{"foo":[true],"bar":null}}`
      );

      const result = new NexemajReader(input).read();
      expect(result).toStrictEqual({
        key: "hello",
        key2: 25,
        key3: 23.32,
        key4: true,
        key5: ["hola", 12, true, false],
        key6: {
          foo: [true],
          bar: null,
        },
      });
    });
  });
});
