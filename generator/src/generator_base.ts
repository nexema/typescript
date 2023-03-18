/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonTypes, DecoderMethods, EncoderMethods } from './constants'
import { Generator } from './generator'
import {
    JsObj,
    NexemaFile,
    NexemaPrimitiveValueType,
    NexemaTypeDefinition,
    NexemaTypeValueType,
    NexemaValueType,
} from './models'
import { TypeReference } from './type_reference'
import { isJsPrimitive, toCamelCase } from './utils'

export abstract class GeneratorBase {
    protected _type: NexemaTypeDefinition
    protected _file: NexemaFile
    protected _fieldNames: { [key: string]: string }

    public constructor(type: NexemaTypeDefinition, file: NexemaFile) {
        this._type = type
        this._file = file
        this._fieldNames = Object.fromEntries(
            type.fields!.map((x) => [x.name, toCamelCase(x.name)])
        )
    }

    protected getDeclarationForTypeReference(ref: TypeReference): string {
        if (ref.path === this._file.path) {
            return ref.type.name
        }

        return `${ref.importAlias}.${ref.type.name}`
    }

    protected resolveReference(objectId: string): TypeReference {
        return Generator.instance.resolveFor(this._file, objectId)
    }

    protected getJavascriptType(type: NexemaValueType): string {
        let jsType: string
        if (type.kind === 'primitiveValueType') {
            const primitiveType = type as NexemaPrimitiveValueType
            switch (primitiveType.primitive) {
                case 'string':
                    jsType = 'string'
                    break

                case 'boolean':
                    jsType = 'boolean'
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
                    break

                case 'int':
                case 'uint':
                case 'uint64':
                case 'int64':
                    jsType = 'bigint'
                    break

                case 'timestamp':
                    jsType = 'Date'
                    break

                case 'duration':
                    jsType = 'bigint'
                    break

                case 'list':
                    jsType = `Array<${this.getJavascriptType(
                        primitiveType.arguments![0]
                    )}>`
                    break

                case 'map':
                    jsType = `Map<${this.getJavascriptType(
                        primitiveType.arguments![0]
                    )}, ${this.getJavascriptType(primitiveType.arguments![1])}>`
                    break

                default:
                    throw `unknown primitive ${primitiveType.primitive}`
            }
        } else {
            const ref = Generator.instance.resolveFor(
                this._file,
                (type as NexemaTypeValueType).objectId
            )
            jsType = this.getDeclarationForTypeReference(ref)
        }

        if (type.nullable) {
            jsType += '| null'
        }

        return jsType
    }

    protected _writeNexemaFields(): string {
        return `{
            ${this._type
                .fields!.map(
                    (x) => `${x.index}: {
                index: ${x.index},
                jsName: "${this._fieldNames[x.name]}",
                name: "${x.name}",
                value: ${this._writeNexemaFieldValue(x.type!)}
            }`
                )
                .join(',')}
        }`
    }

    protected _writeNexemaFieldValue(type: NexemaValueType): string {
        let kind: string
        if (type.kind === 'primitiveValueType') {
            kind = (type as NexemaPrimitiveValueType).primitive
        } else {
            kind = Generator.instance.getObject(
                (type as NexemaTypeValueType).objectId
            ).modifier
        }

        return `{
            kind: "${kind}"
        }`
    }

    protected _writeNexemaFieldsByJsName(): string {
        return `{
            ${this._type
                .fields!.map((x) => `${this._fieldNames[x.name]}: ${x.index}`)
                .join(', ')}}`
    }

    protected _writeTypeInfo(): string {
        return `private static readonly _typeInfo: ${
            CommonTypes.NexemaTypeInfo
        } = {
            fieldsByIndex: ${this._writeNexemaFields()},
            fieldsByJsName: ${this._writeNexemaFieldsByJsName()}
        }`
    }

    protected _writeValueToJsObj(
        variableName: string,
        valueType: NexemaValueType
    ): string {
        let out = ''
        let writeNullable = false
        if (valueType.kind === 'primitiveValueType') {
            const primitiveValue = valueType as NexemaPrimitiveValueType
            switch (primitiveValue.primitive) {
                case 'list': {
                    const elementType = primitiveValue.arguments![0]
                    if (elementType.kind === 'primitiveValueType') {
                        out = `Array.from(${variableName})`
                    } else {
                        out = `${variableName}.map(x => x.toObject())`
                    }
                    writeNullable = true
                    break
                }

                case 'map': {
                    const elementType = primitiveValue.arguments![1]
                    if (elementType.kind === 'primitiveValueType') {
                        out = `Object.fromEntries(${variableName})`
                    } else {
                        out = `Object.fromEntries(Array.from(${variableName}, (entry) => [entry[0], entry[1].toObject()]))`
                    }
                    break
                    writeNullable = true
                }

                default: {
                    out = `${variableName}`
                    break
                }
            }
        } else {
            out = `${variableName}.toObject()`
            writeNullable = true
        }

        if (valueType.nullable && writeNullable) {
            out = `${variableName} ? ${out} : null`
        }

        return out
    }

    protected _writeFieldEncoder(
        variableName: string,
        valueType: NexemaValueType
    ): string {
        if (valueType.nullable) {
            return `if(${variableName}) {
                ${this._getEncoder(variableName, valueType)}
            } else {
                writer.encodeNull();
            }`
        } else {
            return this._getEncoder(variableName, valueType)
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
        valueType: NexemaValueType
    ): string {
        if (valueType.kind === 'primitiveValueType') {
            const primitiveValue = valueType as NexemaPrimitiveValueType
            switch (primitiveValue.primitive) {
                case 'binary':
                    return `new Uint8Array(${variableName})`

                case 'timestamp':
                    return `new Date(${variableName})`

                case 'list': {
                    const elementType = primitiveValue.arguments![0]
                    if (isJsPrimitive(elementType)) {
                        return `Array.from(${variableName})`
                    }

                    return `Array.from(${variableName}, () => ${this._writeDeepCloneValue(
                        'x',
                        elementType
                    )})`
                }

                case 'map': {
                    const elementType = primitiveValue.arguments![1]
                    if (isJsPrimitive(elementType)) {
                        return `new Map(${variableName})`
                    }

                    return `new Map(Array.from(${variableName}), ([key, value]) => [key, ${this._writeDeepCloneValue(
                        'value',
                        elementType
                    )}])`
                }

                default:
                    return variableName
            }
        } else {
            const ref = this.resolveReference(
                (valueType as NexemaTypeValueType).objectId
            )

            return `${ref.type.name}.clone()`
        }
    }

    protected _writeJsObj(value: JsObj): string {
        const type = typeof value
        if (type === 'string') {
            return `"${value}"`
        } else if (
            type === 'boolean' ||
            type === 'bigint' ||
            type === 'number'
        ) {
            return value.toString()
        } else if (type === 'object') {
            return `new Map([${Object.entries(value)
                .map(([key, value]) => `[${key}: ${this._writeJsObj(value)}]`)
                .join(',')}])`
        } else {
            return `[${(value as JsObj[])
                .map((x) => this._writeJsObj(x))
                .join(',')}]`
        }
    }

    private _getEncoder(
        variableName: string,
        valueType: NexemaValueType
    ): string {
        if (valueType.kind === 'primitiveValueType') {
            const primitiveValue = valueType as NexemaPrimitiveValueType
            if (primitiveValue.primitive === 'list') {
                const elementType = primitiveValue.arguments![0]
                return `writer.beginArray((${variableName}).length);
                for(const value of ${variableName}) {
                    ${this._writeFieldEncoder('value', elementType)}
                }`
            } else if (primitiveValue.primitive === 'map') {
                const keyType = primitiveValue.arguments![0]
                const elementType = primitiveValue.arguments![1]
                return `writer.beginMap(${variableName}.size); 
                for(const entry of ${variableName}.entries()) {
                    ${this._writeFieldEncoder('entry[0]', keyType)}
                    ${this._writeFieldEncoder('entry[1]', elementType)}
                }`
            } else {
                const encodeMethod = EncoderMethods[primitiveValue.primitive]
                return `writer.${encodeMethod}(${variableName})`
            }
        } else {
            const ref = this.resolveReference(
                (valueType as NexemaTypeValueType).objectId
            )
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
                const elementType = primitiveValueType.arguments![0]
                return `new Map(Array.from({length: reader.beginDecodeMap()}, () => [${this._getDecoder(
                    keyType
                )}, ${this._writeFieldDecoder(elementType)}]))`
            } else {
                const decoder = DecoderMethods[primitiveValueType.primitive]
                return `reader.${decoder}()`
            }
        } else {
            const ref = this.resolveReference(
                (valueType as NexemaTypeValueType).objectId
            )

            const decl = this.getDeclarationForTypeReference(ref)
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
