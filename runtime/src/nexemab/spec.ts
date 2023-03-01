export const NexemabSpec = {
    NULL: 0xc0,
    BoolTrue: 0x01,
    BoolFalse: 0x00,
    ArrayBegin: 0xdc,
    MapBegin: 0xdf,
    MaxVarintLen: 10,
    UvarintMin: 0x80,
    UvarintMinBigInt: BigInt(0x80),
    TextEncoder: new TextEncoder(),
    TextDecoder: new TextDecoder()
};