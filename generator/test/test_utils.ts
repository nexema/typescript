import prettier from 'prettier'
import { PrettierSettings } from '../src/constants'
import {
    JsObj,
    NexemaPrimitive,
    NexemaPrimitiveValueType,
    NexemaTypeDefinition,
    NexemaTypeFieldDefinition,
    NexemaTypeValueType,
    NexemaValueType,
} from '../src/models'

export function formatSource(input: string): string {
    return prettier.format(input, PrettierSettings)
}

export function getStruct(data: {
    id?: string
    name: string
    fields: NexemaTypeFieldDefinition[]
    documentation?: string[]
    annotations?: { [key: string]: any }
    defaults?: { [key: string]: JsObj }
    baseTypeId?: string
}): NexemaTypeDefinition {
    return {
        id: data.id ?? '1',
        name: data.name,
        fields: data.fields,
        annotations: data.annotations ?? {},
        defaults: data.defaults ?? {},
        baseType: data.baseTypeId ?? null,
        modifier: 'struct',
        documentation: data.documentation ?? [],
    }
}

export function getEnum(data: {
    id?: string
    name: string
    fields: string[]
    documentation?: string[]
    annotations?: { [key: string]: any }
}): NexemaTypeDefinition {
    return {
        id: data.id ?? '1',
        name: data.name,
        fields: data.fields.map(
            (x, i) =>
                ({
                    index: i,
                    name: x,
                } as NexemaTypeFieldDefinition)
        ),
        annotations: data.annotations ?? {},
        defaults: null,
        baseType: null,
        modifier: 'enum',
        documentation: data.documentation ?? [],
    }
}

export function getBaseType(data: {
    id?: string
    name: string
    fields: NexemaTypeFieldDefinition[]
    documentation?: string[]
    annotations?: { [key: string]: any }
    defaults?: { [key: string]: JsObj }
}): NexemaTypeDefinition {
    return {
        id: data.id ?? '1',
        name: data.name,
        fields: data.fields,
        annotations: data.annotations ?? {},
        defaults: data.defaults ?? {},
        baseType: null,
        modifier: 'base',
        documentation: data.documentation ?? [],
    }
}

export function getField(
    index: number,
    name: string,
    valueType: NexemaValueType,
    data?: { documentation?: string[]; annotations?: { [key: string]: any } }
): NexemaTypeFieldDefinition {
    return {
        index,
        name,
        type: valueType,
        annotations: data?.annotations ?? {},
        documentation: data?.documentation ?? [],
    }
}

export function getPrimitiveValueType(
    primitive: NexemaPrimitive,
    nullable?: boolean
): NexemaValueType {
    return {
        kind: 'primitiveValueType',
        primitive: primitive,
        nullable: nullable,
    } as NexemaPrimitiveValueType
}

export function getTypeValueType(typeId: string, nullable?: boolean): NexemaValueType {
    return {
        kind: 'customType',
        nullable: nullable,
        objectId: typeId,
    } as NexemaTypeValueType
}

export function getListValueType(element: NexemaValueType, nullable?: boolean): NexemaValueType {
    return {
        kind: 'primitiveValueType',
        primitive: 'list',
        nullable: nullable,
        arguments: [element],
    } as NexemaPrimitiveValueType
}

export function getMapValueType(
    key: NexemaValueType,
    value: NexemaValueType,
    nullable?: boolean
): NexemaValueType {
    return {
        kind: 'primitiveValueType',
        primitive: 'map',
        nullable: nullable,
        arguments: [key, value],
    } as NexemaPrimitiveValueType
}
