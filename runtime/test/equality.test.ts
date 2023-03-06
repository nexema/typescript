import { listEquals, mapEquals, primitiveEquals } from "../src/equality";
import { PrimitiveMapObj } from "../src/primitives";
import { EnumA } from "./test_utils";

describe("Test equality methods on different types", () => {
    test("Test enum equality", () => {
        const blue = EnumA.blue;
        const red = EnumA.red;

        expect(blue.equals(red)).toBeFalsy();
        expect(blue.equals(EnumA.blue)).toBeTruthy();
    });

    test("Test primitive equals", () => {
        expect(primitiveEquals('number', 27, 27)).toBeTruthy();
        expect(primitiveEquals('string', "hola", "hola")).toBeTruthy();
        expect(primitiveEquals('number', -9n, -9n)).toBeTruthy();
        expect(primitiveEquals('number', 8n, 8)).toBeTruthy();
        expect(primitiveEquals('number', 8n, "8")).toBeTruthy();
        expect(primitiveEquals('number', 8, "8")).toBeTruthy();
        expect(primitiveEquals('boolean', true, true)).toBeTruthy();
        expect(primitiveEquals('binary', new Uint8Array([27, 42, 9, 124]), new Uint8Array([27, 42, 9, 124]))).toBeTruthy();
        expect(primitiveEquals('binary', new Uint8Array([27, 42]), new Uint8Array([27]))).toBeFalsy();
        expect(primitiveEquals('binary', new Uint8Array([27, 42]), new Uint8Array([42, 27]))).toBeFalsy();
        expect(primitiveEquals('number', null, 5)).toBeFalsy();
    });

    test("Test list equals", () => {
        expect(listEquals('primitive', 'bigint', [8n, 7n, 12n], [8n, 7n, 12n])).toBeTruthy();
        expect(listEquals('primitive', 'string', ["a", "b", "c"], ["b", "c"])).toBeFalsy();
        expect(listEquals('primitive', 'string', ["a", "b", "c"], ["b", "c", "a"])).toBeFalsy();
        expect(listEquals('type', 'enum', [EnumA.blue, EnumA.red], [EnumA.blue, EnumA.red])).toBeTruthy();
        expect(listEquals('type', 'enum', [EnumA.blue, EnumA.red], [EnumA.unknown, EnumA.red])).toBeFalsy();
    });

    test("Test map (object) equals", () => {
        expect(mapEquals('primitive', 'string', {
            "key": "hello",
            "second": "world"
        } as PrimitiveMapObj, {
            "key": "hello",
            "second": "world"
        } as PrimitiveMapObj)).toBeTruthy();

        expect(mapEquals('primitive', 'string', {
            "key": "hello"
        } as PrimitiveMapObj, {
            "key": "hello",
            "second": "world"
        } as PrimitiveMapObj)).toBeFalsy();

        expect(mapEquals('primitive', 'string', {
            "key": "hello",
            "2": "world"
        } as PrimitiveMapObj, {
            "key": "hello",
            "second": "world"
        } as PrimitiveMapObj)).toBeFalsy();

        expect(mapEquals('primitive', 'string', {
            "key": "hello",
            "second": true
        } as PrimitiveMapObj, {
            "key": "hello",
            "second": "world"
        } as PrimitiveMapObj)).toBeFalsy();

        expect(mapEquals('type', 'enum', {
            "key": EnumA.blue,
            "second": EnumA.red
        } as PrimitiveMapObj, {
            "key": EnumA.blue,
            "second": EnumA.red
        } as PrimitiveMapObj)).toBeTruthy();

        expect(mapEquals('type', 'enum', {
            "key": EnumA.blue,
            "second": EnumA.red
        } as PrimitiveMapObj, {
            "key": EnumA.blue,
            "second": EnumA.unknown
        } as PrimitiveMapObj)).toBeFalsy();
    });

    test("Test map (Map) equals", () => {
        expect(mapEquals('primitive', 'string', new Map(Object.entries({
            "key": "hello",
            "second": "world"
        })), new Map(Object.entries({
            "key": "hello",
            "second": "world"
        })))).toBeTruthy();

        expect(mapEquals('primitive', 'string', new Map(Object.entries({
            "key": "hello"
        })), new Map(Object.entries({
            "key": "hello",
            "second": "world"
        })))).toBeFalsy();

        expect(mapEquals('primitive', 'string', new Map(Object.entries({
            "key": "hello",
            "2": "world"
        })), new Map(Object.entries({
            "key": "hello",
            "second": "world"
        })))).toBeFalsy();

        expect(mapEquals('primitive', 'string', new Map(Object.entries({
            "key": "hello",
            "second": true
        })), new Map(Object.entries({
            "key": "hello",
            "second": "world"
        })))).toBeFalsy();

        expect(mapEquals('type', 'enum', new Map(Object.entries({
            "key": EnumA.blue,
            "second": EnumA.red
        })), new Map(Object.entries({
            "key": EnumA.blue,
            "second": EnumA.red
        })))).toBeTruthy();

        expect(mapEquals('type', 'enum', new Map(Object.entries({
            "key": EnumA.blue,
            "second": EnumA.red
        })), new Map(Object.entries({
            "key": EnumA.blue,
            "second": EnumA.unknown
        })))).toBeFalsy();
    });
});