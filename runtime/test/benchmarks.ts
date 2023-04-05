import { NexemajSpec } from "../src/nexemaj/spec";
import { benchmark } from "./test_utils";

const input = "this is a really long string that can be written";

benchmark("TextEncoder", () => {
  const encoder = new TextEncoder();
  encoder.encode(input);
});

// Object being written: {key: 12, key2: "hello world", key3: true, key4: ["hola", 12, 22342.21, true, false]}
const textEncoder = new TextEncoder();
benchmark("Write string object", () => {
  const object = {
    key: 12,
    key2: "hello world",
    key3: true,
    key4: [12, 22342.21, 2, -555],
  };
  const result = `{"key":${object["key"]},"key2":"${object["key2"]}","key3":${
    object["key3"]
  },"key4":[${object["key4"].map((x) => x).join(",")}]}`;

  textEncoder.encode(result);
});
