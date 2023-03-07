/**
 * The types created here does not represent the actual generated code for TypeScript, they
 * are simplified versions useful for testing only.
 */

import { JsObj } from "../src/primitives";
import { Clonable, Mergeable, NexemaEnum, NexemaStruct, NexemaUnion } from "../src/type";

export class EnumA extends NexemaEnum<EnumA> {
    private constructor(index: number, name: string){
        super(index, name);
    }

    public static readonly unknown: EnumA = new EnumA(0, 'unknown');
    public static readonly red: EnumA = new EnumA(1, 'red');
    public static readonly blue: EnumA = new EnumA(2, 'blue');
}

export class StructA extends NexemaStruct<StructA> implements Mergeable<StructA>, Clonable<StructA> {
    public encode(): Uint8Array {
        throw new Error("Method not implemented.");
    }
    public toObject(): JsObj {
        throw new Error("Method not implemented.");
    }

    public constructor() {
        super({
            fields: [
                {
                    index: 0,
                    jsName: "firstName",
                    name: "first_name",
                    value: {
                        jsKind: 'primitive',
                        kind: 'string',
                    }
                },
                {
                    index: 1,
                    jsName: "tags",
                    name: "tags",
                    value: {
                        jsKind: 'list',
                        kind: 'list',
                        arguments: [
                            {
                                jsKind: 'primitive',
                                kind: 'string',
                            }
                        ]
                    }
                },
                {
                    index: 2,
                    jsName: "preferences",
                    name: "preferences",
                    value: {
                        jsKind: 'map',
                        kind: 'map',
                        arguments: [
                            {
                                jsKind: 'primitive',
                                kind: 'string',
                            },
                            {
                                jsKind: 'primitive',
                                kind: 'boolean',
                            }
                        ]
                    }
                },
                {
                    index: 3,
                    jsName: "enum",
                    name: "enum",
                    value: {
                        jsKind: 'type',
                        kind: 'enum'
                    }
                },
            ],
            values: ["", new Array<string>, new Map<string, boolean>, EnumA.unknown]
        })
    }

    public get firstName(): string {
        return this._state.values[0] as string;
    }

    public set firstName(value: string) {
        this._state.values[0] = value;
    }

    public get tags(): string[] {
        return this._state.values[1] as string[];
    }

    public set tags(value: string[]) {
        this._state.values[1] = value;
    }

    public get preferences(): Map<string, boolean> {
        return this._state.values[2] as Map<string, boolean>;
    }

    public set preferences(value: Map<string, boolean>) {
        this._state.values[2] = value;
    }

    public get enum(): EnumA {
        return this._state.values[3] as EnumA;
    }

    public set enum(value: EnumA) {
        this._state.values[3] = value;
    }

    public mergeUsing(other: StructA): void {
        throw new Error("Method not implemented.");
    }

    public clone(): StructA {
        throw new Error("Method not implemented.");
    }
}

export class UnionA extends NexemaUnion<UnionA, 'firstName' | 'tags' | 'preferences' | 'enum'> {
    public encode(): Uint8Array {
        throw new Error("Method not implemented.");
    }
    public toObject(): JsObj {
        throw new Error("Method not implemented.");
    }

    public constructor() {
        super({
            fields: [
                {
                    index: 0,
                    jsName: "firstName",
                    name: "first_name",
                    value: {
                        jsKind: 'primitive',
                        kind: 'string',
                    }
                },
                {
                    index: 1,
                    jsName: "tags",
                    name: "tags",
                    value: {
                        jsKind: 'list',
                        kind: 'list',
                        arguments: [
                            {
                                jsKind: 'primitive',
                                kind: 'string',
                            }
                        ]
                    }
                },
                {
                    index: 2,
                    jsName: "preferences",
                    name: "preferences",
                    value: {
                        jsKind: 'map',
                        kind: 'map',
                        arguments: [
                            {
                                jsKind: 'primitive',
                                kind: 'string',
                            },
                            {
                                jsKind: 'primitive',
                                kind: 'boolean',
                            }
                        ]
                    }
                },
                {
                    index: 3,
                    jsName: "enum",
                    name: "enum",
                    value: {
                        jsKind: 'type',
                        kind: 'enum'
                    }
                },
            ],
            currentValue: undefined,
            fieldIndex: -1
        })
    }

    public get firstName(): string {
        return this._state.currentValue as string;
    }

    public set firstName(value: string) {
        this._state.currentValue = value;
        this._state.fieldIndex = 0;
    }

    public get tags(): string[] {
        return this._state.currentValue as string[];
    }

    public set tags(value: string[]) {
        this._state.currentValue = value;
        this._state.fieldIndex = 1;
    }

    public get preferences(): Map<string, boolean> {
        return this._state.currentValue as Map<string, boolean>;
    }

    public set preferences(value: Map<string, boolean>) {
        this._state.currentValue = value;
        this._state.fieldIndex = 2;
    }

    public get enum(): EnumA {
        return this._state.currentValue as EnumA;
    }

    public set enum(value: EnumA) {
        this._state.currentValue = value;
        this._state.fieldIndex = 3;
    }
}