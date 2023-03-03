import { NexemabWriter } from '../src/nexemab/writer';
import { NexemabReader } from '../src/nexemab/reader';
import { Numbers } from '../src/numbers';

describe("Nexemab", () => {
    describe("Encoder", () => {
        type TestCase = {[key: string]: [(writer: NexemabWriter) => void, Array<number>, Error?]};
        const testCases: TestCase = {
            "true": [(writer) => writer.encodeBool(true), [0x01]],
            "false": [(writer) => writer.encodeBool(false), [0x00]],
            "null": [(writer) => writer.encodeNull(), [0xc0]],
            "uint8(12)": [(writer) => writer.encodeUint8(12), [0x0c]],
            "uint8(${Numbers.uint8MaxValue})": [(writer) => writer.encodeUint8(Numbers.uint8MaxValue), [255]],
            "uint8(0)": [(writer) => writer.encodeUint8(Numbers.uintMinValue), [0]],
            "uint16(${Numbers.uint16MaxValue})": [(writer) => writer.encodeUint16(Numbers.uint16MaxValue), [255, 255]],
            "uint16(${Numbers.uint16MinValue})": [(writer) => writer.encodeUint16(Numbers.uintMinValue), [0, 0]],
            "uint32(${Numbers.uint32MaxValue})": [(writer) => writer.encodeUint32(Numbers.uint32MaxValue), [255, 255, 255, 255]],
            "uint32(${Numbers.uint32MinValue})": [(writer) => writer.encodeUint32(Numbers.uintMinValue), [0, 0, 0, 0]],
            "int8(12)": [(writer) => writer.encodeInt8(12), [0x0c]],
            "int8(-12)": [(writer) => writer.encodeUint8(12), [0xc]],
            "int8(${Numbers.int8MaxValue})": [(writer) => writer.encodeInt8(Numbers.int8MaxValue), [127]],
            "int8(${Numbers.int8MinValue})": [(writer) => writer.encodeInt8(Numbers.int8MinValue), [128]],
            "int16(${Numbers.int16MaxValue})": [(writer) => writer.encodeInt16(Numbers.int16MaxValue), [127, 255]],
            "int16(${Numbers.int16MinValue})": [(writer) => writer.encodeInt16(Numbers.int16MinValue), [128, 0]],
            "int32(${Numbers.int32MaxValue})": [(writer) => writer.encodeInt32(Numbers.int32MaxValue), [127, 255, 255, 255]],
            "int32(${Numbers.int32MinValue})": [(writer) => writer.encodeInt32(Numbers.int32MinValue), [128, 0, 0, 0]],
            "varint(1)": [(writer) => writer.encodeVarint(1n), [2]],
            "varint(267)": [(writer) => writer.encodeVarint(267n), [150, 4]],
            "varint(392)": [(writer) => writer.encodeVarint(392n), [144, 6]],
            "varint(59992)": [(writer) => writer.encodeVarint(59992n), [176, 169, 7]],
            "varint(${Numbers.uint32MaxValue})": [(writer) => writer.encodeVarint(BigInt(Numbers.uint32MaxValue)), [254, 255, 255, 255, 31]],
            "varint(${Numbers.int32MaxValue})": [(writer) => writer.encodeVarint(BigInt(Numbers.int32MaxValue)), [254, 255, 255, 255, 15]],
            "varint(maxint64)": [(writer) => writer.encodeVarint(Numbers.int64MaxValue), [0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1]],
            "uint64(maxuint64)": [(writer) => writer.encodeUint64(Numbers.uint64MaxValue), [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]],
            "uint64(maxuint64-25513)": [(writer) => writer.encodeUint64(Numbers.uint64MaxValue - BigInt(25513)), [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x9c, 0x56]],
            "int64(maxint64)": [(writer) => writer.encodeInt64(Numbers.int64MaxValue), [0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]],
            "int64(minint64)": [(writer) => writer.encodeInt64(Numbers.int64MinValue), [128, 0, 0, 0, 0, 0, 0, 0]],
            "float32(max)": [(writer) => writer.encodeFloat32(Numbers.float32MaxValue), [0x7f, 0x7f, 0xff, 0xff]],
            "float32(min)": [(writer) => writer.encodeFloat32(Numbers.float32MinValue), [0x0, 0x0, 0x0, 0x1]],
            "float32(23.4324)": [(writer) => writer.encodeFloat32(23.4324), [0x41, 0xbb, 0x75, 0x8e]],
            "float64(max)": [(writer) => writer.encodeFloat64(Numbers.float64MaxValue), [0x7f, 0xef, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]],
            "float64(min)": [(writer) => writer.encodeFloat64(Numbers.float64MinValue), [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1]],
            "string(hello world)": [(writer) => writer.encodeString("hello world"), [0x16, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64]],
            "string(<ŇTź՗YƙHc)": [(writer) => writer.encodeString("<ŇTź՗YƙHc"), [0x1e, 0x3c, 0xc2, 0x95, 0xc5, 0x87, 0x54, 0xc5, 0xba, 0xd5, 0x97, 0x59, 0xc6, 0x99, 0x48, 0x63]],
            "binary": [(writer) => writer.encodeBinary(new Uint8Array([25, 20, 23, 11, 23, 11, 77])), [0xe, 0x19, 0x14, 0x17, 0xb, 0x17, 0xb, 0x4d]],
            "list(varint x5)": [(writer) => writer.beginArray(5).encodeVarint(13241n).encodeVarint(1231413n).encodeVarint(5n).encodeVarint(998989n).encodeVarint(1129928n), [0xdc, 0xa, 0xf2, 0xce, 0x1, 0xea, 0xa8, 0x96, 0x1, 0xa, 0x9a, 0xf9, 0x79, 0x90, 0xf7, 0x89, 0x1]],
            "map(string,float32 x3)": [(writer => writer.beginMap(3).encodeString("abc").encodeFloat32(213141.24125123).encodeString("v").encodeFloat32(-4314.34123).encodeString("9928910sad").encodeFloat32(-3224.99980989078489378)), [0xdf, 0x6, 0x6, 0x61, 0x62, 0x63, 0x48, 0x50, 0x25, 0x4f, 0x2, 0x76, 0xc5, 0x86, 0xd2, 0xbb, 0x14, 0x39, 0x39, 0x32, 0x38, 0x39, 0x31, 0x30, 0x73, 0x61, 0x64, 0xc5, 0x49, 0x8f, 0xff]],
        };  

        for(const entry of Object.entries(testCases)) {
            const testName = entry[0];
            const callback = entry[1][0];
            const want = entry[1][1];

            test(testName, () => {
                const writer = new NexemabWriter();
                callback(writer);

                const got = writer.takeBytes();
                expect(got).toStrictEqual(new Uint8Array(want));
            });
        }
    });

    describe("Decoder", () => {
        type TestCase = {[key: string]: [input: Array<number>, fn: (reader: NexemabReader) => any, want: any, err?: Error]};
        const testCases: TestCase = {
            "true": [[0x01], (reader) => reader.decodeBool(), true],
            "false": [[0x00], (decoder) => decoder.decodeBool(), false],
            "isNextNull": [[0xc0], (decoder) => decoder.isNextNull(), true],
            "isNextNull returns false if not null":  [[0x5], (decoder) => decoder.isNextNull(), false],
            "uvarint(1)":  [[1], (decoder) => decoder.decodeUvarint(), 1n],
            "uvarint(1000)":  [[232, 7], (decoder) => decoder.decodeUvarint(), 1000n],
            "uvarint(267)":  [[139, 2], (decoder) => decoder.decodeUvarint(), 267n],
            "uvarint(59992)":  [[216, 212, 3], (decoder) => decoder.decodeUvarint(), 59992n],
            "uvarint(maxuint32)":  [[255, 255, 255, 255, 15], (decoder) => decoder.decodeUvarint(), BigInt(Numbers.uint32MaxValue)],
            "uvarint(maxuint64)":  [[255, 255, 255, 255, 255, 255, 255, 255, 255, 1], (decoder) => decoder.decodeUvarint(), Numbers.uint64MaxValue],
            "uvarint(maxint64)":  [[255, 255, 255, 255, 255, 255, 255, 255, 127], (decoder) => decoder.decodeUvarint(), Numbers.int64MaxValue],
            "uvarint(maxint64) with extra bytes":  [[0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f, 0x23, 0x45, 0x98], (decoder) => decoder.decodeUvarint(), Numbers.int64MaxValue],
            "uvarint(1504) with extra bytes":  [[224, 11, 2, 0x76, 0x98], (decoder) => decoder.decodeUvarint(), 1504n],
            "uvarint(overflow) should overflow":  [[255, 255, 255, 255, 255, 255, 255, 255, 255, 127], (decoder) => decoder.decodeUvarint(), null, new Error("uvarint overflow")],
            "uvarint(overflow) should overflow 2":  [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 127], (decoder) => decoder.decodeUvarint(), null, new Error("uvarint overflow")],
            "varint(1)":  [[2], (decoder) => decoder.decodeVarint(), 1n],
            "varint(267)":  [[150, 4], (decoder) => decoder.decodeVarint(), 267n],
            "varint(392)":  [[144, 6], (decoder) => decoder.decodeVarint(), 392n],
            "varint(59992)":  [[176, 169, 7], (decoder) => decoder.decodeVarint(), 59992n],
            "varint(maxuint32)":  [[0xfe, 0xff, 0xff, 0xff, 0x1f], (decoder) => decoder.decodeVarint(), BigInt(Numbers.uint32MaxValue)],
            "varint(maxint32)":  [[0xfe, 0xff, 0xff, 0xff, 0xf], (decoder) => decoder.decodeVarint(), BigInt(Numbers.int32MaxValue)],
            "varint(maxint64)":  [[0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1], (decoder) => decoder.decodeVarint(), Numbers.int64MaxValue],
            "varint(maxint64) with extra bytes":  [[0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1, 0x5, 0x09, 0x77, 0x23], (decoder) => decoder.decodeVarint(), Numbers.int64MaxValue],
            "string(hello world)":  [[0x16, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64], (decoder) => decoder.decodeString(), "hello world"],
            "string(<ŇTź՗YƙHc)":  [[0x1e, 0x3c, 0xc2, 0x95, 0xc5, 0x87, 0x54, 0xc5, 0xba, 0xd5, 0x97, 0x59, 0xc6, 0x99, 0x48, 0x63], (decoder) => decoder.decodeString(), "<ŇTź՗YƙHc"],
            "int8(min)":  [[128], (decoder) => decoder.decodeInt8(), Numbers.int8MinValue],
            "int8(max)":  [[127], (decoder) => decoder.decodeInt8(), Numbers.int8MaxValue],
            "int16(min)":  [[128, 0], (decoder) => decoder.decodeInt16(), Numbers.int16MinValue],
            "int16(max)":  [[127, 255], (decoder) => decoder.decodeInt16(), Numbers.int16MaxValue],
            "int32(min)":  [[128, 0, 0, 0], (decoder) => decoder.decodeInt32(), Numbers.int32MinValue],
            "int32(max)":  [[127, 255, 255, 255], (decoder) => decoder.decodeInt32(), Numbers.int32MaxValue],
            "int64(min)":  [[128, 0, 0, 0, 0, 0, 0, 0], (decoder) => decoder.decodeInt64(), Numbers.int64MinValue],
            "int64(max)":  [[127, 255, 255, 255, 255, 255, 255, 255], (decoder) => decoder.decodeInt64(), Numbers.int64MaxValue],
            "int64AsBigInt(24151241321)":  [[0x0, 0x0, 0x0, 0x5, 0x9f, 0x86, 0xb2, 0x69], (decoder) => decoder.decodeInt64(), 24151241321n],
            "uint8(0)":  [[0], (decoder) => decoder.decodeUint8(), 0],
            "uint8(max)":  [[255], (decoder) => decoder.decodeUint8(), Numbers.uint8MaxValue],
            "uint16(0)":  [[0, 0], (decoder) => decoder.decodeInt16(), 0],
            "uint16(max)":  [[255, 255], (decoder) => decoder.decodeUint16(), Numbers.uint16MaxValue],
            "uint32(0)":  [[0, 0, 0, 0], (decoder) => decoder.decodeUint32(), 0],
            "uint32(max)":  [[255, 255, 255, 255], (decoder) => decoder.decodeUint32(), Numbers.uint32MaxValue],
            "uint64(0)":  [[0, 0, 0, 0, 0, 0, 0, 0], (decoder) => decoder.decodeUint64(), 0n],
            "uint64(max)":  [[255, 255, 255, 255, 255, 255, 255, 255], (decoder) => decoder.decodeUint64(), Numbers.uint64MaxValue],
            "float32(max)":  [[0x7f, 0x7f, 0xff, 0xff], (decoder) => decoder.decodeFloat32(), Numbers.float32MaxValue],
            "float32(min)":  [[0x0, 0x0, 0x0, 0x1], (decoder) => decoder.decodeFloat32(), Numbers.float32MinValue],
            "float64(max)":  [[0x7f, 0xef, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff], (decoder) => decoder.decodeFloat64(), Numbers.float64MaxValue],
            "float64(min)":  [[0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1], (decoder) => decoder.decodeFloat64(), Numbers.float64MinValue],
            "binary":  [[0xe, 0x19, 0x14, 0x17, 0xb, 0x17, 0xb, 0x4d], (decoder) => decoder.decodeBinary(), new Uint8Array([25, 20, 23, 11, 23, 11, 77])],
            "list(string)":  [
              [0xdc, 0xa, 0x8, 0x68, 0x6f, 0x6c, 0x61, 0xa, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0xe, 0x74, 0x65, 0x72, 0x63, 0x65, 0x72, 0x6f, 0xa, 0x74, 0x68, 0x69, 0x72, 0x64, 0x6, 0x62, 0x79, 0x65], 
              (decoder) => Array.from({length: decoder.beginDecodeArray()}, () => decoder.decodeString()), ["hola", "hello", "tercero", "third", "bye"]],
            "map(string,varint)": [
              [0xdf, 0x6, 0x2, 0x61, 0x96, 0xad, 0x2f, 0x2, 0x62, 0xc2, 0xe, 0x6, 0x62, 0x79, 0x65, 0xaa, 0xa1, 0xa0, 0xc], 
              (decoder) => Object.fromEntries(Array.from({length: decoder.beginDecodeMap()}, () => [decoder.decodeString(), decoder.decodeVarint()])), {"a": 387915n, "b": 929n, "bye": 12847189n}],
            "list fails if not an array": [
              [0xdf, 0x6, 0x2, 0x61, 0x96, 0xad, 0x2f, 0x2, 0x62, 0xc2, 0xe, 0x6, 0x62, 0x79, 0x65, 0xaa, 0xa1, 0xa0, 0xc], 
              (decoder) => Array.from({length: decoder.beginDecodeArray()}, () => decoder.decodeString()), null, new Error("not an array")],
            "map fails if not a map": [
              [0xdc, 0xa, 0x8, 0x68, 0x6f, 0x6c, 0x61, 0xa, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0xe, 0x74, 0x65, 0x72, 0x63, 0x65, 0x72, 0x6f, 0xa, 0x74, 0x68, 0x69, 0x72, 0x64, 0x6, 0x62, 0x79, 0x65], 
              (decoder) => Object.fromEntries(Array.from({length: decoder.beginDecodeMap()}, () => [decoder.decodeString(), decoder.decodeVarint()])), null, new Error("not a map")]
        };

        for(const entry of Object.entries(testCases)) {
            const testName = entry[0];
            const input = new Uint8Array(entry[1][0]);
            const callback = entry[1][1];
            const want = entry[1][2];
            const wantErr = entry[1][3];

            test(testName, () => {
                const reader = new NexemabReader(input);
                try {
                    const got = callback(reader);
                    expect(got).toStrictEqual(want);
                } catch(err) {
                    expect(err).toStrictEqual(wantErr);
                }
            });
        }
    });
}); 