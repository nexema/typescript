import { NexemajSpec } from "../src/nexemaj/spec";
import { NexemajWriter } from "../src/nexemaj/writer";

describe("Nexemaj", () => {
  test("Writer", () => {
    const writer = new NexemajWriter();
    writer.writeToken(NexemajSpec.ObjectStart);
    writer.writeKey("test");
    writer.writeBool(true);
    writer.writeKey("second");
    writer.writeNumber(151241);
    writer.writeKey("array");
    writer.writeToken(NexemajSpec.ArrayStart);
    writer.writeNumber(13.2);
    writer.writeBool(false);
    writer.writeNull();
    writer.writeArrayEnd();
    writer.writeKey("obj");
    writer.writeToken(NexemajSpec.ObjectStart);
    writer.writeKey("nested");
    writer.writeString("hello");
    writer.writeObjectEnd();
    writer.writeObjectEnd();

    const got = writer.asString();
    const want = `{"test":true,"second":151241,"array":[13.2,false,null],"obj":{"nested":"hello"}}`;
    expect(got).toBe(want);
  });
});
