/* eslint-disable @typescript-eslint/no-non-null-assertion */
// declare module 'JsonEncoderWriter' {}

import { NexemaPrimitiveValueType, NexemaTypeFieldDefinition, NexemaValueType } from './models'

export function forStruct(fields: NexemaTypeFieldDefinition[]): string {
    let result = 'public override toJson(): string {'

    const writtenFields: string[] = []
    for (const field of fields) {
        const local = `"${field.name}":${writeJsonEncode(`this.${field.name}`, field.type!)}`
        writtenFields.push(local)
    }

    result += `return \`${writtenFields.join(',')}\`}`
    return result
}

function writeJsonEncode(variableName: string, valueType: NexemaValueType): string {
    let out = ''
    if (valueType.kind === 'primitiveValueType') {
        const primitiveType = valueType as NexemaPrimitiveValueType
        switch (primitiveType.primitive) {
            case 'string':
                out = `"\${${variableName}}"`
                if (valueType.nullable) {
                    out = `\${${variableName} ? \`${out}\` : null}`
                }
                break

            case 'int':
            case 'uint':
            case 'int64':
            case 'uint64': {
                if (valueType.nullable) {
                    out = `\${${variableName} ? \`\${${variableName}.toString()}\` : null}`
                } else {
                    out = `\${${variableName}.toString()}`
                }
                break
            }

            case 'int8':
            case 'int16':
            case 'int32':
            case 'uint8':
            case 'uint16':
            case 'uint32':
            case 'float32':
            case 'float64':
            case 'boolean':
            case 'duration':
                if (valueType.nullable) {
                    out = `\${${variableName} ?? null}`
                } else {
                    out = `\${${variableName}}`
                }
                break

            case 'timestamp':
                out = `\${${variableName}.toISOString()}`
                if (valueType.nullable) {
                    out = `${variableName} ? \`\${${out}}\` : null`
                }
                break

            case 'list': {
                const elementType = primitiveType.arguments![0]
                out = `[${variableName}.map(x => ${writeJsonEncode('x', elementType)}).join(",")]`
                break
            }

            case 'map': {
                const map = new Map<string, number>()
                const reuslt = Array.from(map, ([key, value]) => '')
                const keyType = primitiveType.arguments![0]
                const elementType = primitiveType.arguments![1]
                out = `{}`
                break
            }

            default:
                out = 'unknown'
                break
        }
    } else {
        out = `${variableName}.toJson()`
    }

    return out
}
