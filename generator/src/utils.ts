/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { GenerateContext } from './generate_context'
import {
    NexemaFile,
    NexemaPrimitiveValueType,
    NexemaTypeValueType,
    NexemaValueType,
} from './models'
import { TypeReference } from './type_reference'

export function toCamelCase(input: string): string {
    return input.toLowerCase().replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase())
}

export function toSnakeCase(input: string): string {
    return input.replace(/[A-Z]/g, (letter, index) => {
        return index == 0 ? letter.toLowerCase() : '_' + letter.toLowerCase()
    })
}

export function isJsPrimitive(valueType: NexemaValueType): boolean {
    if (valueType.kind === 'primitiveValueType') {
        switch ((valueType as NexemaPrimitiveValueType).primitive) {
            case 'binary':
            case 'timestamp':
            case 'list':
            case 'map':
                return false

            default:
                return true
        }
    } else {
        return false
    }
}

export function getJavascriptType(
    context: GenerateContext,
    file: NexemaFile,
    type: NexemaValueType,
    omitNullability?: boolean
): string {
    let jsType: string
    if (type.kind === 'primitiveValueType') {
        const primitiveType = type as NexemaPrimitiveValueType
        switch (primitiveType.primitive) {
            case 'string':
                jsType = 'string'
                omitNullability ??= false
                break

            case 'bool':
                jsType = 'boolean'
                omitNullability ??= false
                break

            case 'binary':
                jsType = 'Uint8Array'
                break

            case 'int8':
            case 'uint8':
            case 'int16':
            case 'uint16':
            case 'int32':
            case 'uint32':
            case 'float32':
            case 'float64':
                jsType = 'number'
                omitNullability ??= false
                break

            case 'int':
            case 'uint':
            case 'uint64':
            case 'int64':
                jsType = 'bigint'
                omitNullability ??= false
                break

            case 'timestamp':
                jsType = 'Date'
                break

            case 'duration':
                jsType = 'bigint'
                omitNullability ??= false
                break

            case 'list':
                jsType = `Array<${getJavascriptType(context, file, primitiveType.arguments![0])}>`
                break

            case 'map':
                jsType = `Map<${getJavascriptType(
                    context,
                    file,
                    primitiveType.arguments![0]
                )}, ${getJavascriptType(context, file, primitiveType.arguments![1])}>`
                break

            default:
                throw `unknown primitive ${primitiveType.primitive}`
        }
    } else {
        const ref = context.resolveFor(file, (type as NexemaTypeValueType).objectId)
        jsType = getDeclarationForTypeReference(file, ref)
    }

    if (type.nullable && !omitNullability) {
        jsType += '| null'
    }

    return jsType
}

export function getDeclarationForTypeReference(file: NexemaFile, ref: TypeReference): string {
    if (ref.path === file.path) {
        return ref.type.name
    }

    return `${ref.importAlias}.${ref.type.name}`
}
