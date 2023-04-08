import prettier from 'prettier'

export const ImportAlias = {
    Nexema: '$nex',
} as const

export const DefaultImports = {
    Nexema: "import * as $nex from 'nexema'",
} as const

export const CommonTypes = {
    NexemaTypeInfo: '$nex.NexemaTypeInfo',
    JsObj: '$nex.JsObj',
    NexemabWriter: '$nex.NexemabWriter',
    NexemabReader: '$nex.NexemabReader',
    NexemaClonable: '$nex.NexemaClonable',
    NexemaMergeable: '$nex.NexemaMergeable',
    Base64Encoder: '$nex.Base64.bytesToBase64',
} as const

export const PrettierSettings: prettier.Options = {
    arrowParens: 'always',
    bracketSameLine: true,
    parser: 'typescript',
    quoteProps: 'preserve',
    trailingComma: 'es5',
    semi: false,
    singleQuote: true,
} as const

export const EncoderMethods: { [key: string]: string } = {
    string: 'encodeString',
    boolean: 'encodeBool',
    uint: 'encodeUvarint',
    int: 'encodeVarint',
    uint8: 'encodeUint8',
    uint16: 'encodeUint16',
    uint32: 'encodeUint32',
    uint64: 'encodeUint64',
    int8: 'encodeInt8',
    int16: 'encodeInt16',
    int32: 'encodeInt32',
    int64: 'encodeInt64',
    float32: 'encodeFloat32',
    float64: 'encodeFloat64',
    binary: 'encodeBinary',
    list: 'beginArray',
    map: 'beginMap',
    timestamp: 'encodeTimestamp',
    duration: 'encodeDuration',
} as const

export const DecoderMethods: { [key: string]: string } = {
    string: 'decodeString',
    boolean: 'decodeBool',
    uint: 'decodeUvarint',
    int: 'decodeVarint',
    uint8: 'decodeUint8',
    uint16: 'decodeUint16',
    uint32: 'decodeUint32',
    uint64: 'decodeUint64',
    int8: 'decodeInt8',
    int16: 'decodeInt16',
    int32: 'decodeInt32',
    int64: 'decodeInt64',
    float32: 'decodeFloat32',
    float64: 'decodeFloat64',
    binary: 'decodeBinary',
    list: 'beginDecodeArray',
    map: 'beginDecodeMap',
    timestamp: 'decodeTimestamp',
    duration: 'decodeDuration',
} as const
