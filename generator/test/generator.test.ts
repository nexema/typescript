import fs from 'fs'
import path from 'path'
import { Generator } from '../src/generator'
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
        /*
        dependency list:
        a.nex -> Bar (same file), Baz (b.nex), Abc (c.nex)
        c.nex -> Baz (b.nex)
        */

        const snapshot = {
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
                                getField(3, 'd', getTypeValueType('4')),
                                getField(4, 'bin', getPrimitiveValueType('binary')),
                                getField(6, 'nbin', getPrimitiveValueType('binary', true)),
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
                            id: '4',
                            name: 'Abc',
                            fields: [
                                getField(0, 'y', getListValueType(getPrimitiveValueType('string'))),
                                getField(1, 'z', getPrimitiveValueType('uint64')),
                                getField(2, 'w', getTypeValueType('3')),
                            ],
                        }),
                    ],
                },
            ],
        }
        const generator = new Generator(snapshot, { outputPath: '', useOnlyMaps: true })

        const result = generator.run()
        expect(result.errorMessage).toBeUndefined()
        expect(result.exitCode).toBe(0)
        // expect(result.files).toBe([
        //     {
        //         id: '1',
        //         contents: '',
        //         name: 'a.nex.ts',
        //     },
        //     {
        //         id: '2',
        //         contents: '',
        //         name: 'b.nex.ts',
        //     },
        //     {
        //         id: '3',
        //         contents: '',
        //         name: 'c.nex.ts',
        //     },
        // ] as GeneratedFile[])

        for (const file of result.files) {
            const p = `example/src/${snapshot.files.find((x) => x.id == file.id)!.path}.ts`
            fs.mkdirSync(path.dirname(p), { recursive: true })
            fs.writeFileSync(p, file.contents)
        }
    })
})
