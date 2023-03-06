import { listEquals, mapEquals, primitiveEquals } from "./equality";
import { NexemabWriter } from "./nexemab/writer";
import { JsObj, Primitive, PrimitiveList, PrimitiveMap } from "./primitives";
import { NexemaStructState, NexemaUnionState } from "./state";

/**
 * The very base class for every generated Nexema type.
 */
export abstract class Nexemable {
    /**
     * Encodes the current instance to a Uint8Array
     */
    public abstract encode(): Uint8Array;

    /**
     * Converts the current instance to a JavaScript object
     */
    public abstract toObject(): JsObj;

    /**
     * Returns the kind of this Nexemable instance.
     */
    public abstract get kind(): 'enum' | 'struct' | 'union';
}

/**
 * BaseNexemaType represents the base class for every generated Nexema type
 */
export abstract class BaseNexemaType<T extends BaseNexemaType<T>> implements Nexemable {
    public abstract encode(): Uint8Array;
    public abstract toObject(): JsObj;
    public abstract get kind(): "enum" | "struct" | "union";

    /**
     * Returns true if this and [other] are strict equals, otherwise, false.
     */
    public abstract equals(other: T): boolean;
}

/**
 * NexemaMergeable provides methods to merge a type with other type or with binary information.
 */
export abstract class NexemaMergeable<T extends BaseNexemaType<T>> {
    /**
     * Merges the buffer into the current type, overriding any set field.
     * 
     * @param buffer The buffer to merge from.
     */
    public abstract mergeFrom(buffer: Uint8Array): void;

    /**
     * Merges [other] into the current type, overriding any set field.
     * 
     * @param other The type to merge from.
     */
    public abstract mergeUsing(other: T): void;
}

/**
 * NexemaStruct is the base class for every Nexema struct or base type.
 */
export abstract class NexemaStruct<T extends NexemaStruct<T>> extends BaseNexemaType<T> {
    protected _state: NexemaStructState;
    
    public constructor(state: NexemaStructState) {
        super();
        this._state = state;
    }

    public override equals(other: T): boolean {
        const a = this.valueOf();
        const values = this._state.values;
        const otherValues = other._state.values;

        for(let i = 0; i < values.length; i++) {
            const field = other._state.fields[i];
            const a = values[i];
            const b = otherValues[i];

            switch(field.value.jsKind) {
                case 'primitive':
                    if(!primitiveEquals(field.value.kind, a as Primitive, b as Primitive)) {
                        return false;
                    }
                    break;

                case 'list':
                    const argumentType = field.value.arguments![0];
                    if(!listEquals(argumentType.jsKind, argumentType.kind, a as PrimitiveList, b as PrimitiveList)) {
                        return false;
                    }
                    break;

                case 'map':
                    const valueType = field.value.arguments![1];
                    if(!mapEquals(valueType.jsKind, valueType.kind, a as PrimitiveMap, b as PrimitiveMap)) {
                        return false;
                    }
                    break;

                case 'type':
                    if(!(a as any).equals(b as any)) {
                        return false;
                    }
                    break;
            }

        }

        return false;
    }

    public override get kind(): "enum" | "struct" | "union" {
        return 'struct';
    }
}

/**
 * NexemaUnion is the base class for every Nexema union type.
 */
export abstract class NexemaUnion<T extends NexemaUnion<T>> extends BaseNexemaType<T> {
    protected _state: NexemaUnionState;

    public constructor(state: NexemaUnionState) {
        super();
        this._state = state;
    }

    public override equals(other: T): boolean {
        if(this._state.fieldIndex !== other._state.fieldIndex) {
            return false;
        }

        const a = this._state.currentValue;
        const b = other._state.currentValue;
        const field = this._state.fields[this._state.fieldIndex];

        switch(field.value.jsKind) {
            case 'primitive':
                if(!primitiveEquals(field.value.kind, a as Primitive, b as Primitive)) {
                    return false;
                }
                break;

            case 'list':
                const argumentType = field.value.arguments![0];
                if(!listEquals(argumentType.jsKind, argumentType.kind, a as PrimitiveList, b as PrimitiveList)) {
                    return false;
                }
                break;

            case 'map':
                const valueType = field.value.arguments![1];
                if(!mapEquals(valueType.jsKind, valueType.kind, a as PrimitiveMap, b as PrimitiveMap)) {
                    return false;
                }
                break;

            case 'type':
                if(!(a as any).equals(b as any)) {
                    return false;
                }
                break;
        }

        return false;
    }

    public override get kind(): "enum" | "struct" | "union" {
        return 'union';
    }
}

/**
 * NexemaEnum is the base class for every nexema enum type
 */
export abstract class NexemaEnum<T extends NexemaEnum<T>> extends BaseNexemaType<T> {
    private _index: number;
    private _name: string;

    public constructor(index: number, name: string) {
        super();
        this._index = index;
        this._name = name;
    }

    /**
     * Returns the name of this enum value.
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Returns the index of this enum value.
     */
    public get index(): number {
        return this._index;
    }

    public override equals(other: T): boolean {
        return this._index === other._index;
    }

    public override get kind(): "enum" | "struct" | "union" {
        return 'enum';
    }

    public override encode(): Uint8Array {
        const writer = new NexemabWriter();
        writer.encodeUint8(this._index);
        return writer.takeBytes();
    }

    public override toObject(): JsObj {
        return this._index;
    }

}
