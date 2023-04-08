/* eslint-disable @typescript-eslint/no-non-null-assertion */
// declare module 'JsonEncoderWriter' {}

import { CommonTypes } from './constants'
import { GenerateContext } from './generate_context'
import {
    NexemaFile,
    NexemaPrimitiveValueType,
    NexemaTypeFieldDefinition,
    NexemaValueType,
} from './models'
import { getJavascriptType } from './utils'

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

            case 'binary': {
                out = betweenQuotes(
                    betweenBracesEscaped(`${CommonTypes.Base64Encoder}(${variableName})`)
                )
                if (valueType.nullable) {
                    out = betweenBracesEscaped(ternary(variableName, stringInterpo(out)))
                }
                break
            }

            default:
                throw `unknown type ${JSON.stringify(valueType)}`
        }
    } else {
        out = `\${${variableName}.toJson()}`
    }

    return out
}
