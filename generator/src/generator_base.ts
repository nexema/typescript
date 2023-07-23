/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonTypes, DecoderMethods, EncoderMethods } from './constants'
import { GenerateContext } from './generate_context'
import {
    JsObj,
    NexemaFile,
    NexemaPrimitiveValueType,
    NexemaTypeDefinition,
    NexemaTypeValueType,
    NexemaValueType,
} from './models'
import { TypeReference } from './type_reference'
import {
    getDeclarationForTypeReference,
    getJavascriptType,
    isJsPrimitive,
    toCamelCase,
} from './utils'
import * as p from 'path'

export abstract class GeneratorBase {
    protected _type: NexemaTypeDefinition
    protected _typeQualifiedName: string
    protected _file: NexemaFile
    protected _context: GenerateContext
    protected _fieldNames: { [key: string]: string }

    public constructor(type: NexemaTypeDefinition, file: NexemaFile, context: GenerateContext) {
        this._type = type
        this._typeQualifiedName = p.join(
            context.generatorOptions.projectName,
            p.dirname(file.path),
            type.name
        )
        this._file = file
        this._context = context
        this._fieldNames = Object.fromEntries(
            type.fields!.map((x) => [x.name, toCamelCase(x.name)])
        )
    }

    protected resolveReference(objectId: string): TypeReference {
        return this._context.resolveFor(this._file, objectId)
    }

    protected getJavascriptDefaultValueFor(type: NexemaValueType): string {
        if (type.kind === 'primitiveValueType') {
            switch ((type as NexemaPrimitiveValueType).primitive) {
                case 'string':
                    return "''"

                case 'bool':
                    return 'false'

                case 'uint':
                case 'int':
                case 'uint64':
                case 'uint32':
                case 'duration':
                    return '0n'

                case 'int8':
                case 'int16':
                case 'int32':
                case 'int64':
                case 'uint8':
                case 'uint16':
                case 'float32':
                case 'float64':
                    return '0'

                case 'binary':
                    return 'new Uint8Array()'

                case 'list':
                    return '[]'

                case 'map':
                    return 'new Map()'

                case 'timestamp':
                    return 'new Date(0)'

                default:
                    return 'undefined'
            }
        } else {
            const ref = this.resolveReference((type as NexemaTypeValueType).objectId)
            if (ref.type.modifier === 'enum') {
                return `${getDeclarationForTypeReference(this._file, ref)}.${
                    ref.type.fields![0].name
                }`
            } else {
                return `${getDeclarationForTypeReference(this._file, ref)}.createEmpty()`
            }
        }
    }

    protected _writeHeader(
        docs: string[] | null,
        annotations: { [key: string]: JsObj } | null,
        isField = false
    ): string {
        docs ??= []
        annotations ??= {}

        let result = ``
        const annotationsLen = Object.keys(annotations).length
        const shouldWrite = docs.length > 0 || annotationsLen > 0
        if (shouldWrite) {
            result += '/**\n'
        }

        if (docs.length > 0) {
            result += `${docs.map((x) => `* ${x}`).join('\n')}\n`
        }

        if (annotations['obsolete']) {
            result += `* @deprecated ${
                isField
                    ? 'This field is deprecated and should not be used'
                    : 'This class is deprecated and should not be used'
            }\n`
        }

        if (shouldWrite) {
            result += '*/'
        }

        return result
    }

    protected _writeNexemaFields(skipValue = false): string {
        return `{
            ${this._type
                .fields!.map(
                    (x) => `${x.index}: {
                index: ${x.index},
                jsName: "${this._fieldNames[x.name]}",
                name: "${x.name}", 
                value: ${skipValue ? 'undefined' : `${this._writeNexemaFieldValue(x.type!)}`} 
            }`
                )
                .join(',')}
        }`
    }

    protected _writeNexemaFieldValue(type: NexemaValueType): string {
        let kind: string
        let objectId: string | undefined
        let args: NexemaValueType[] | undefined
        if (type.kind === 'primitiveValueType') {
            const primitiveType = type as NexemaPrimitiveValueType
            kind = primitiveType.primitive
            args = primitiveType.arguments
        } else {
            objectId = (type as NexemaTypeValueType).objectId
            kind = this._context.getObject(objectId).modifier
        }

        let result = `{
            kind: "${kind}",
            nullable: ${type.nullable ?? false},
        `

        if (objectId) {
            result += `${objectId ? `typeId: "${objectId}",` : ''}`
        }

        if (args) {
            result += `${
                args
                    ? `arguments: [${args.map((x) => this._writeNexemaFieldValue(x)).join(', ')}]`
                    : ''
            }`
        }

        return result + `}`
    }

    protected _writeNexemaFieldsByJsName(): string {
        return `{
            ${this._type.fields!.map((x) => `${this._fieldNames[x.name]}: ${x.index}`).join(', ')}}`
    }

    protected _writeTypeInfo(): string {
        return `private static readonly _typeInfo: ${CommonTypes.NexemaTypeInfo} = {
            typeId: "${this._type.id}",
            name: "${this._type.name}",
            fullName: "${this._typeQualifiedName}",
            new: () => ${this._type.name}.createEmpty(),
            inherits: ${
                this._type.baseType
                    ? `{
                name: "${this.resolveReference(this._type.baseType).type.name}"
            }`
                    : 'null'
            },
            kind: "${this._type.modifier}",
            fieldsByIndex: ${this._writeNexemaFields()},
            fieldsByJsName: ${this._writeNexemaFieldsByJsName()}
        }`
    }

    protected _writeQualifiedNameGetter(): string {
        return `public static override get qualifiedName(): string {
            return this._typeInfo.fullName;
        }`
    }

    protected _writeValueToJsObj(
        variableName: string,
        valueType: NexemaValueType,
        writePrimitiveTypes = false
    ): string {
        let out = ''
        let writeNullable = false
        if (valueType.kind === 'primitiveValueType') {
            const primitiveValue = valueType as NexemaPrimitiveValueType
            switch (primitiveValue.primitive) {
                case 'list': {
                    const elementType = primitiveValue.arguments![0]
                    if (elementType.kind === 'primitiveValueType') {
                        out = `Array.from(${variableName} as ${getJavascriptType(
                            this._context,
                            this._file,
                            valueType,
                            true
                        )})`
                    } else {
                        out = `(${variableName} as ${getJavascriptType(
                            this._context,
                            this._file,
                            valueType,
                            true
                        )}).map(x => x.toObject())`
                    }
                    writeNullable = true
                    break
                }

                case 'map': {
                    const elementType = primitiveValue.arguments![1]
                    if (elementType.kind === 'primitiveValueType') {
                        out = `Object.fromEntries(${variableName} as ${getJavascriptType(
                            this._context,
                            this._file,
                            valueType,
                            true
                        )})`
                    } else {
                        out = `Object.fromEntries(Array.from((${variableName} as ${getJavascriptType(
                            this._context,
                            this._file,
                            valueType,
                            true
                        )}), (entry) => [entry[0], entry[1].toObject()]))`
                    }
                    writeNullable = true
                    break
                }

                default: {
                    out = writePrimitiveTypes
                        ? `${variableName} as ${getJavascriptType(
                              this._context,
                              this._file,
                              valueType
                          )}`
                        : variableName
                    break
                }
            }
        } else {
            const ref = this.resolveReference((valueType as NexemaTypeValueType).objectId)
            if (ref.type.modifier === 'enum') {
                out = `(${variableName} as ${getDeclarationForTypeReference(this._file, ref)})${
                    valueType.nullable ? '?' : ''
                }.index`
            } else {
                out = `(${variableName} as ${getDeclarationForTypeReference(this._file, ref)})${
                    valueType.nullable ? '?' : ''
                }.toObject()`
            }
        }

        if (valueType.nullable && writeNullable) {
            out = `(${variableName} as ${getJavascriptType(
                this._context,
                this._file,
                valueType
            )}) ? ${out} : null`
        }

        return out
    }

    protected _writeFieldEncoder(
        variableName: string,
        valueType: NexemaValueType,
        skipAlias = false,
        skipNullability?: boolean
    ): string {
        if (valueType.nullable) {
            return `if(${variableName} ${
                skipAlias ? '' : `as ${getJavascriptType(this._context, this._file, valueType)}`
            }) {
                ${this._getEncoder(variableName, valueType, false, skipNullability ?? true)}
            } else {
                writer.encodeNull();
            }`
        } else {
            return this._getEncoder(variableName, valueType, skipAlias, skipNullability ?? false)
        }
    }

    protected _writeFieldDecoder(valueType: NexemaValueType): string {
        if (valueType.nullable) {
            return `reader.isNextNull() ? null : ${this._getDecoder(valueType)}`
        } else {
            return this._getDecoder(valueType)
        }
    }

    protected _writeDeepCloneValue(
        variableName: string,
        valueType: NexemaValueType,
        writePrimitiveTypes = false
    ): string {
        let shouldWriteNullable = true
        let result = ''
        if (valueType.kind === 'primitiveValueType') {
            const primitiveValue = valueType as NexemaPrimitiveValueType
            switch (primitiveValue.primitive) {
                case 'binary':
                    result = `new Uint8Array(${variableName} as Uint8Array)`
                    break

                case 'timestamp': {
                    result = `new Date(${variableName} as Date)`
                    break
                }

                case 'list': {
                    const elementType = primitiveValue.arguments![0]
                    const decl = `Array.from(${variableName} as ${getJavascriptType(
                        this._context,
                        this._file,
                        valueType,
                        true
                    )}`
                    if (isJsPrimitive(elementType)) {
                        result = `${decl})`
                        break
                    }

                    result = `${decl}, () => ${this._writeDeepCloneValue('x', elementType)})`
                    break
                }

                case 'map': {
                    const elementType = primitiveValue.arguments![1]
                    if (isJsPrimitive(elementType)) {
                        result = `new Map(${variableName} as ${getJavascriptType(
                            this._context,
                            this._file,
                            valueType,
                            true
                        )})`
                        break
                    }

                    result = `new Map(Array.from(${variableName} as ${getJavascriptType(
                        this._context,
                        this._file,
                        valueType,
                        true
                    )}, ([key, value]) => [key, ${this._writeDeepCloneValue(
                        'value',
                        elementType
                    )}]))`
                    break
                }

                default:
                    shouldWriteNullable = false
                    result = writePrimitiveTypes
                        ? `${variableName} as ${getJavascriptType(
                              this._context,
                              this._file,
                              valueType
                          )}`
                        : variableName
                    break
            }
        } else {
            const ref = this.resolveReference((valueType as NexemaTypeValueType).objectId)

            if (ref.type.modifier === 'enum') {
                if (valueType.nullable) {
                    result = `${getJavascriptType(
                        this._context,
                        this._file,
                        valueType,
                        true
                    )}.values[(${variableName} as ${getJavascriptType(
                        this._context,
                        this._file,
                        valueType
                    )})?.index ?? 0]`
                } else {
                    result = `${getJavascriptType(
                        this._context,
                        this._file,
                        valueType,
                        true
                    )}.values[(${variableName} as ${getJavascriptType(
                        this._context,
                        this._file,
                        valueType
                    )}).index]`
                }
            } else {
                result = `(${variableName} as ${getJavascriptType(
                    this._context,
                    this._file,
                    valueType
                )})${valueType.nullable ? '?' : ''}.clone()`
            }
            shouldWriteNullable = false
        }

        if (shouldWriteNullable && valueType.nullable) {
            result = `(${variableName} as ${getJavascriptType(
                this._context,
                this._file,
                valueType
            )}) ? ${result} : null`
        }

        return result
    }

    protected _writeJsObj(value: JsObj): string {
        const type = typeof value
        if (type === 'string') {
            return `"${value}"`
        } else if (type === 'boolean' || type === 'bigint' || type === 'number') {
            return value.toString()
        } else if (type === 'object') {
            return `new Map([${Object.entries(value)
                .map(([key, value]) => `[${this._writeJsObj(key)}, ${this._writeJsObj(value)}]`)
                .join(',')}])`
        } else {
            return `[${(value as JsObj[]).map((x) => this._writeJsObj(x)).join(',')}]`
        }
    }

    private _getEncoder(
        variableName: string,
        valueType: NexemaValueType,
        skipAlias: boolean,
        skipNullable = false
    ): string {
        if (!skipAlias) {
            variableName = `(${variableName} as ${getJavascriptType(
                this._context,
                this._file,
                valueType,
                skipNullable
            )})`
        }

        if (valueType.kind === 'primitiveValueType') {
            const primitiveValue = valueType as NexemaPrimitiveValueType
            if (primitiveValue.primitive === 'list') {
                const elementType = primitiveValue.arguments![0]
                return `writer.beginArray((${variableName}).length);
                for(const value of ${variableName}) {
                    ${this._writeFieldEncoder('value', elementType, true, true)}
                }`
            } else if (primitiveValue.primitive === 'map') {
                const keyType = primitiveValue.arguments![0]
                const elementType = primitiveValue.arguments![1]
                return `writer.beginMap(${variableName}.size); 
                for(const entry of ${variableName}.entries()) {
                    ${this._writeFieldEncoder('entry[0]', keyType, true)}
                    ${this._writeFieldEncoder('entry[1]', elementType, true, true)}
                }`
            } else {
                const encodeMethod = EncoderMethods[primitiveValue.primitive]
                return `writer.${encodeMethod}(${variableName})`
            }
        } else {
            const ref = this.resolveReference((valueType as NexemaTypeValueType).objectId)
            if (ref.type.modifier === 'enum') {
                return `writer.encodeUint8(${variableName}.index)`
            } else {
                return `writer.encodeBinary(${variableName}.encode())`
            }
        }
    }

    private _getDecoder(valueType: NexemaValueType): string {
        if (valueType.kind === 'primitiveValueType') {
            const primitiveValueType = valueType as NexemaPrimitiveValueType
            if (primitiveValueType.primitive === 'list') {
                const elementType = primitiveValueType.arguments![0]
                return `Array.from({length: reader.beginDecodeArray()}, () => ${this._writeFieldDecoder(
                    elementType
                )})`
            } else if (primitiveValueType.primitive === 'map') {
                const keyType = primitiveValueType.arguments![0]
                const elementType = primitiveValueType.arguments![1]
                return `new Map(Array.from({length: reader.beginDecodeMap()}, () => [${this._getDecoder(
                    keyType
                )}, ${this._writeFieldDecoder(elementType)}]))`
            } else {
                const decoder = DecoderMethods[primitiveValueType.primitive]
                return `reader.${decoder}()`
            }
        } else {
            const ref = this.resolveReference((valueType as NexemaTypeValueType).objectId)

            const decl = getDeclarationForTypeReference(this._file, ref)
            if (ref.type.modifier === 'enum') {
                return `${decl}.byIndex(reader.decodeUint8()) ?? ${decl}.${toCamelCase(
                    ref.type.fields![0].name
                )}`
            } else {
                return `${decl}.decode(reader.decodeBinary())`
            }
        }
    }
}
