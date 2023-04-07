/* eslint-disable @typescript-eslint/no-non-null-assertion */
// declare module 'JsonEncoderWriter' {}

import { GenerateContext } from './generate_context'
import {
    NexemaFile,
    NexemaPrimitiveValueType,
    NexemaTypeFieldDefinition,
    NexemaTypeValueType,
    NexemaValueType,
} from './models'
import { TypeReference } from './type_reference'

export function forStruct(fields: NexemaTypeFieldDefinition[]): string {
    let result = 'public override toJson(): string {'

    const writtenFields: string[] = []
    for (const field of fields) {
        const local = `"${field.name}":${writeJsonEncode(`this.${field.name}`, field.type!)}`
        writtenFields.push(local)
    }

    result += `return \`{${writtenFields.join(',')}}\`}`
    return result
}

export function forUnion(
    context: GenerateContext,
    file: NexemaFile,
    fields: NexemaTypeFieldDefinition[]
): string {
    return `public override toJson(): string {
        switch(this._state.fieldIndex) {
            ${fields
                .map(
                    (x) => `case ${x.index}: {
                    return \`${writeJsonEncode(
                        `(this._state.currentValue as ${getJavascriptType(
                            context,
                            file,
                            x.type!,
                            false
                        )})`,
                        x.type!
                    )}\`;
                }`
                )
                .join('\n')}

            default: {
                return "null";
            }
        }
    }`
}

function betweenBracesEscaped(input: string): string {
    return `\${${input}}`
}

function betweenBraces(input: string): string {
    return `{${input}}`
}

function betweenBrackets(input: string): string {
    return `[${input}]`
}

function betweenQuotes(input: string): string {
    return `"${input}"`
}

function stringInterpo(input: string): string {
    return `\`${input}\``
}

function ternary(first: string, second: string): string {
    return `${first} ? ${second} : null`
}

function mapWithJoin(input: string, conversion: string): string {
    return `${input}.map(x => ${stringInterpo(conversion)}).join(",")`
}

function writeJsonEncode(variableName: string, valueType: NexemaValueType): string {
    let out = ''
    if (valueType.kind === 'primitiveValueType') {
        const primitiveType = valueType as NexemaPrimitiveValueType
        switch (primitiveType.primitive) {
            case 'string':
                out = betweenQuotes(betweenBracesEscaped(variableName))
                if (valueType.nullable) {
                    out = betweenBracesEscaped(ternary(variableName, stringInterpo(out)))
                }
                break

            case 'int':
            case 'uint':
            case 'int64':
            case 'uint64': {
                out = betweenQuotes(betweenBracesEscaped(variableName))
                if (valueType.nullable) {
                    out = betweenBracesEscaped(ternary(variableName, stringInterpo(out)))
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
                out = betweenBracesEscaped(variableName)
                break

            case 'timestamp':
                out = betweenQuotes(betweenBracesEscaped(`${variableName}.toISOString()`))
                if (valueType.nullable) {
                    out = betweenBracesEscaped(ternary(variableName, stringInterpo(out)))
                }
                break

            case 'list': {
                const elementType = primitiveType.arguments![0]
                const elementEncode = writeJsonEncode('x', elementType)

                out = betweenBrackets(
                    betweenBracesEscaped(mapWithJoin(variableName, elementEncode))
                )
                if (valueType.nullable) {
                    out = betweenBracesEscaped(ternary(variableName, stringInterpo(out)))
                }
                break
            }

            case 'map': {
                const keyType = primitiveType.arguments![0]
                const keyEncode = writeJsonEncode('key', keyType)

                const elementType = primitiveType.arguments![1]
                const elementEncode = writeJsonEncode('value', elementType)

                out = betweenBraces(
                    betweenBracesEscaped(
                        `Array.from(${variableName}, (([key, value]) => ${stringInterpo(
                            `${keyEncode}:${elementEncode}`
                        )})).join(",")`
                    )
                )

                if (valueType.nullable) {
                    out = betweenBracesEscaped(ternary(variableName, stringInterpo(out)))
                }
                break
            }

            default:
                out = 'unknown'
                break
        }
    } else {
        out = `\${${variableName}.toJson()}`
    }

    return out
}

function getJavascriptType(
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

            case 'boolean':
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

function getDeclarationForTypeReference(file: NexemaFile, ref: TypeReference): string {
    if (ref.path === file.path) {
        return ref.type.name
    }

    return `${ref.importAlias}.${ref.type.name}`
}
