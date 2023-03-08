import { NexemaPrimitiveValueType, NexemaSnapshot, NexemaTypeValueType, parseSnapshot } from "../src/models";

it("should parse NexemaSnapshot json using reviver", () => {
    const input = `{"version":1,"hashcode":"10820260093162658565","files":[{"id":"14449249460196398142","fileName":"sample.nex","packageName":"foo","path":"foo","types":[{"id":"","name":"Sample","documentation":null,"annotations":null,"modifier":"struct","baseType":null,"fields":[{"name":"id","index":0,"type":{"arguments":null,"kind":"primitiveValueType","nullable":false,"primitive":"string"},"documentation":null,"annotations":null},{"name":"name","index":1,"type":{"arguments":null,"kind":"primitiveValueType","nullable":false,"primitive":"string"},"documentation":null,"annotations":null},{"name":"enum","index":2,"type":{"kind":"customType","nullable":false,"objectId":"3"},"documentation":null,"annotations":null}],"defaults":null}]}]}`
    const snapshot = parseSnapshot(input);
    expect(snapshot).toEqual({
        version: 1,
        hashcode: "10820260093162658565",
        files: [
            {
                id: "14449249460196398142",
                fileName: "sample.nex",
                packageName: "foo",
                path: "foo",
                types: [
                    {
                        id: "",
                        name: "Sample",
                        modifier: 'struct',
                        baseType: null,
                        annotations: null,
                        documentation: null,
                        defaults: null,
                        fields: [
                            {
                                name: "id",
                                index: 0,
                                annotations: null,
                                documentation: null,
                                type: {
                                    kind: 'primitiveValueType',
                                    arguments: [],
                                    nullable: false,
                                    primitive: 'string'
                                } as NexemaPrimitiveValueType
                            },
                            {
                                name: "name",
                                index: 1,
                                annotations: null,
                                documentation: null,
                                type: {
                                    kind: 'primitiveValueType',
                                    arguments: [],
                                    nullable: false,
                                    primitive: 'string'
                                } as NexemaPrimitiveValueType
                            },
                            {
                                name: "enum",
                                index: 2,
                                annotations: null,
                                documentation: null,
                                type: {
                                    kind: 'customType',
                                    nullable: false,
                                    objectId: "3"
                                } as NexemaTypeValueType
                            }
                        ],
                    }
                ]
            }
        ]
    } as NexemaSnapshot);
});