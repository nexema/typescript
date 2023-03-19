/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as $nex from 'nexema'

export abstract class Base<T extends $nex.NexemaStruct<T>> extends $nex.NexemaStruct<Base<T>> {
    public abstract get varintField(): bigint

    public abstract set varintField(value: bigint)

    public abstract get uvarintField(): bigint

    public abstract set uvarintField(value: bigint)
}

export class A extends Base<A> implements $nex.NexemaMergeable<A>, $nex.NexemaClonable<A> {
    private static readonly _typeInfo: $nex.NexemaTypeInfo = {
        fieldsByIndex: {
            0: {
                index: 0,
                jsName: 'stringField',
                name: 'string_field',
                value: {
                    kind: 'string',
                },
            },
        },
        fieldsByJsName: {
            stringField: 0,
        },
    }

    public constructor(data: { varintField: bigint; uvarintField: bigint; stringField: string }) {
        super({
            typeInfo: A._typeInfo,
            values: [data.stringField],
            baseValues: [data.varintField, data.uvarintField],
        })
    }

    public get stringField(): string {
        return this._state.values[0] as string
    }

    public set stringField(value: string) {
        this._state.values[0] = value
    }

    public override get varintField(): bigint {
        return this._state.baseValues![0] as bigint
    }

    public override set varintField(value: bigint) {
        this._state.baseValues![0] = value
    }

    public override get uvarintField(): bigint {
        return this._state.baseValues![1] as bigint
    }

    public override set uvarintField(value: bigint) {
        this._state.baseValues![1] = value
    }

    public override encode(): Uint8Array {
        const writer = new $nex.NexemabWriter()
        writer.encodeVarint(this.varintField)
        writer.encodeUvarint(this.uvarintField)
        writer.encodeString(this.stringField)
        return writer.takeBytes()
    }

    public mergeFrom(buffer: Uint8Array): void {
        const reader = new $nex.NexemabReader(buffer)
        this._state.baseValues![0] = reader.decodeVarint()
        this._state.baseValues![1] = reader.decodeUvarint()
        this._state.values[0] = reader.decodeString()
    }

    public mergeUsing(other: A): void {
        this._state.baseValues![0] = other._state.baseValues![0]
        this._state.baseValues![1] = other._state.baseValues![1]
        this._state.values[0] = other._state.values[0]
    }

    public override toObject(): $nex.JsObj {
        return {
            varintField: this._state.baseValues![0] as bigint,
            uvarintField: this._state.baseValues![1] as bigint,
            stringField: this._state.values[0] as string,
        }
    }

    public clone(): A {
        return new A({
            varintField: this._state.baseValues![0] as bigint,
            uvarintField: this._state.baseValues![1] as bigint,
            stringField: this._state.values[0] as string,
        })
    }

    public toString(): string {
        return `A(varintField: ${this._state.baseValues![0]}, uvarintField: ${
            this._state.baseValues![1]
        }, stringField: ${this._state.values[0]})`
    }
}
