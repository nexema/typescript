import { listEquals, mapEquals, primitiveEquals } from "../src/equality";
import { PrimitiveMapObj } from "../src/primitives";
import { EnumA, StructA, UnionA } from "./test_utils";

describe("Test equality methods on different types", () => {
    test("Test enum equality", () => {
        const blue = EnumA.blue;
        const red = EnumA.red;

        expect(blue.equals(red)).toBeFalsy();
        expect(blue.equals(EnumA.blue)).toBeTruthy();
    });

    test("Test struct equality", () => {
        const a = new StructA();
        const b = new StructA();

        expect(a.equals(b)).toBeTruthy();
        
        b.firstName = "Tomás";
        expect(a.equals(b)).toBeFalsy();

        b.firstName = "";
        expect(a.equals(b)).toBeTruthy();

        b.tags.push("a value");
        expect(a.equals(b)).toBeFalsy();

        b.tags.pop();
        expect(a.equals(b)).toBeTruthy();

        a.preferences.set("cats", true);
        b.preferences.set("cars", false);
        expect(a.equals(b)).toBeFalsy();

        a.preferences.set("cars", false);
        b.preferences.set("cats", true);
        expect(a.equals(b)).toBeTruthy();

        a.enum = EnumA.red;
        b.enum = EnumA.blue;
        expect(a.equals(b)).toBeFalsy();
        
        b.enum = EnumA.red;
        expect(a.equals(b)).toBeTruthy();
    });

    test("Test union equality", () => {
        const a = new UnionA();
        const b = new UnionA();
        expect(a.equals(b)).toBeTruthy();
        expect(a.whichField).toStrictEqual('not-set');
        expect(b.whichField).toStrictEqual('not-set');

        a.firstName = "Tomás";
        expect(a.equals(b)).toBeFalsy();
        expect(a.whichField).toStrictEqual('firstName');
        expect(b.whichField).toStrictEqual('not-set');

        b.firstName = "Tomás";
        expect(a.equals(b)).toBeTruthy();
        expect(a.whichField).toStrictEqual('firstName');
        expect(b.whichField).toStrictEqual('firstName');

        a.clear();
        expect(a.equals(b)).toBeFalsy();
        expect(a.whichField).toStrictEqual('not-set');
        expect(b.whichField).toStrictEqual('firstName');

        a.firstName = "Jose";
        expect(a.equals(b)).toBeFalsy();
        expect(a.whichField).toStrictEqual('firstName');
        expect(b.whichField).toStrictEqual('firstName');

        a.tags = ["a", "b"];
        b.tags = ["b"];
        expect(a.equals(b)).toBeFalsy();
        expect(a.whichField).toStrictEqual('tags');
        expect(b.whichField).toStrictEqual('tags');

        b.tags.push("b");
        b.tags[0] = "a";
        expect(a.equals(b)).toBeTruthy();

        a.preferences = new Map();
        b.preferences = new Map();
        expect(a.equals(b)).toBeTruthy();
        expect(a.whichField).toStrictEqual('preferences');
        expect(b.whichField).toStrictEqual('preferences');

        b.preferences.set("cats", false);
        expect(a.equals(b)).toBeFalsy();

        a.enum = EnumA.blue;
        b.enum = EnumA.blue;
        expect(a.equals(b)).toBeTruthy();
        expect(a.whichField).toStrictEqual('enum');
        expect(b.whichField).toStrictEqual('enum');

        b.enum = EnumA.unknown;
        expect(a.equals(b)).toBeFalsy();
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