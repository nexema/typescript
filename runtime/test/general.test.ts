import { EnumA, UnionA } from "./test_utils";

describe("Misc tests", () => {
  it("should return false for different types when using isSameType", () => {
    const union = new UnionA();
    const e = EnumA.blue;

    expect(e.isSameType(union)).toBeFalsy();
  });

  it("should return true for same types when using isSameType", () => {
    const a = EnumA.blue;
    const b = EnumA.unknown;

    expect(a.isSameType(b)).toBeTruthy();
  });

  it("should return type info successfully for enums", () => {
    const a = EnumA.unknown;
    expect(() => a.getTypeInfo()).not.toThrow();
    expect(a.getTypeInfo().name).toBe("EnumA");
    expect(a.getTypeInfo().kind).toBe("enum");
    expect(a.getTypeInfo().typeId).toBe("5645615135135");
  });
});
