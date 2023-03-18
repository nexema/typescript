import prettier from 'prettier'
import { PrettierSettings } from '../src/constants'
import {
    JsObj,
    NexemaPrimitive,
    NexemaPrimitiveValueType,
    NexemaTypeDefinition,
    NexemaTypeFieldDefinition,
    NexemaValueType,
} from '../src/models'

export function formatSource(input: string): string {
    return prettier.format(input, PrettierSettings)
}

export function getStruct(data: {
    name: string
    fields: NexemaTypeFieldDefinition[]
    documentation?: string[]
    annotations?: { [key: string]: any }
    defaults?: { [key: string]: JsObj }
    baseTypeId?: string
}): NexemaTypeDefinition {
    return {
        id: '1',
        name: data.name,
        fields: data.fields,
        annotations: data.annotations ?? {},
        defaults: data.defaults ?? {},
        baseType: data.baseTypeId ?? null,
        modifier: 'struct',
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
