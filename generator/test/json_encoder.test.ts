import { PrettierSettings } from '../src/constants'
import * as json_writer from '../src/json_encoder'
import { getField, getPrimitiveValueType } from './test_utils'
import prettier from 'prettier'

describe('JsonEncoderWriter tests', () => {
    test('string', () => {
        const out = json_writer.forStruct([
            getField(1, 's', getPrimitiveValueType('string')),
            getField(2, 'sn', getPrimitiveValueType('string', true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`"s":"\${this.s}","sn":\${this.sn ? \`"\${this.sn}"\` : null}\`}`
        )
    })

    test('number', () => {
        const out = json_writer.forStruct([
            getField(1, 'n', getPrimitiveValueType('int16')),
            getField(2, 'nn', getPrimitiveValueType('int16', true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`"n":\${this.n},"nn":\${this.nn ?? null}\`}`
        )
    })

    test('bigint', () => {
        const out = json_writer.forStruct([
            getField(1, 'b', getPrimitiveValueType('int64')),
            getField(2, 'bn', getPrimitiveValueType('int64', true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`"b":\${this.b.toString()},"bn":\${this.bn ? \`\${this.bn.toString()}\` : null}\`}`
        )
    })
    // test('for struct', () => {
    //     const out = json_writer.forStruct([
    //         getField(1, 'sf', getPrimitiveValueType('string')),
    //         getField(2, 'nsf', getPrimitiveValueType('string', true)),
    //         getField(3, 'i', getPrimitiveValueType('int')),
    //         getField(4, 'ni', getPrimitiveValueType('int', true)),
    //         getField(5, 'u', getPrimitiveValueType('uint64')),
    //         getField(6, 'nu', getPrimitiveValueType('uint64', true)),
    //         getField(7, 'b', getPrimitiveValueType('boolean')),
    //         getField(8, 'nb', getPrimitiveValueType('boolean', true)),
    //         getField(9, 't', getPrimitiveValueType('timestamp')),
    //         getField(10, 'nt', getPrimitiveValueType('timestamp', true)),
    //         getField(11, 'f', getPrimitiveValueType('float32')),
    //     ])

    //     expect(out).toStrictEqual(
    //         `public override toJson(): string {return \`"sf":"\${this.sf}","nsf":\${this.nsf ? \`"\${this.nsf}"\` : null},"i":\${this.i.toString()},"ni":\${this.ni ? \`\${this.ni.toString()}\` : null},"u":\${this.u.toString()},"nu":\${this.nu ? \`\${this.nu.toString()}\` : null},"b":\${this.b},"nb":this.nb ?? null,"t":\${this.t.toISOString()},"nt":\${this.nt ? \`\${this.nt.toISOString()}\` : null},"f":\${this.f}}}`
    //     )
    // })
})
