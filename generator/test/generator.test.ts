import { Generator } from '../src/generator'
import { GeneratedFile } from '../src/models'
import {
    getEnum,
    getField,
    getListValueType,
    getPrimitiveValueType,
    getStruct,
    getTypeValueType,
    getUnion,
} from './test_utils'

describe('Generator tests', () => {
    it('should generate an output for a set of files', () => {
        const generator = new Generator(
            {
                hashcode: '',
                version: 1,
                files: [
                    {
                        id: '1',
                        fileName: 'a.nex',
                        packageName: 'root',
                        path: 'root/a.nex',
                        types: [
                            getStruct({
                                id: '1',
                                name: 'Foo',
                                fields: [
                                    getField(0, 'a', getPrimitiveValueType('string')),
                                    getField(1, 'b', getTypeValueType('2')),
                                    getField(2, 'c', getTypeValueType('3')),
                                ],
                            }),
                            getEnum({
                                id: '2',
                                name: 'Bar',
                                fields: ['unspecified', 'red', 'blue'],
                            }),
                        ],
                    },
                    {
                        id: '2',
                        fileName: 'b.nex',
                        packageName: 'root',
                        path: 'root/b.nex',
                        types: [
                            getEnum({
                                id: '3',
                                name: 'Baz',
                                fields: ['unknown', 'one', 'two'],
                            }),
                        ],
                    },
                    {
                        id: '3',
                        fileName: 'c.nex',
                        packageName: 'foo',
                        path: 'root/foo/c.nex',
                        types: [
                            getUnion({
                                id: '3',
                                name: 'Abc',
                                fields: [
                                    getField(
                                        0,
                                        'y',
                                        getListValueType(getPrimitiveValueType('string'))
                                    ),
                                    getField(1, 'z', getPrimitiveValueType('uint64')),
                                    getField(2, 'w', getTypeValueType('3')),
                                ],
                            }),
                        ],
                    },
                ],
            },
            { outputPath: '', useOnlyMaps: true }
        )

        const result = generator.run()
        expect(result.errorMessage).toBeUndefined()
        expect(result.exitCode).toBe(0)
        expect(result.files).toBe([{}] as GeneratedFile[])
    })
})
