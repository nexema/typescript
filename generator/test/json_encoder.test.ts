import * as json_writer from '../src/json_encoder'
import { getField, getListValueType, getMapValueType, getPrimitiveValueType } from './test_utils'

describe('JsonEncoderWriter tests', () => {
    test('string', () => {
        const out = json_writer.forStruct([
            getField(1, 's', getPrimitiveValueType('string')),
            getField(2, 'sn', getPrimitiveValueType('string', true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`{"s":"\${this.s}","sn":\${this.sn ? \`"\${this.sn}"\` : null}}\`}`
        )
    })

    test('number', () => {
        const out = json_writer.forStruct([
            getField(1, 'n', getPrimitiveValueType('int16')),
            getField(2, 'nn', getPrimitiveValueType('float32', true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`{"n":\${this.n},"nn":\${this.nn}}\`}`
        )
    })

    test('bigint', () => {
        const out = json_writer.forStruct([
            getField(1, 'b', getPrimitiveValueType('int64')),
            getField(2, 'bn', getPrimitiveValueType('int64', true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`{"b":"\${this.b}","bn":\${this.bn ? \`"\${this.bn}"\` : null}}\`}`
        )
    })

    test('timestamp', () => {
        const out = json_writer.forStruct([
            getField(1, 't', getPrimitiveValueType('timestamp')),
            getField(2, 'tn', getPrimitiveValueType('timestamp', true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`{"t":"\${this.t.toISOString()}","tn":\${this.tn ? \`"\${this.tn.toISOString()}"\` : null}}\`}`
        )
    })

    test('boolean', () => {
        const out = json_writer.forStruct([
            getField(1, 'b', getPrimitiveValueType('boolean')),
            getField(2, 'bn', getPrimitiveValueType('boolean', true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`{"b":\${this.b},"bn":\${this.bn}}\`}`
        )
    })

    test('list', () => {
        const out = json_writer.forStruct([
            getField(1, 'l', getListValueType(getPrimitiveValueType('string'))),
            getField(2, 'ln', getListValueType(getPrimitiveValueType('string'), true)),
            getField(3, 'lvn', getListValueType(getPrimitiveValueType('string', true))),
            getField(4, 'lfn', getListValueType(getPrimitiveValueType('string', true), true)),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`{"l":[\${this.l.map(x => \`"\${x}"\`).join(",")}],"ln":\${this.ln ? \`[\${this.ln.map(x => \`"\${x}"\`).join(",")}]\` : null},"lvn":[\${this.lvn.map(x => \`\${x ? \`"\${x}"\` : null}\`).join(",")}],"lfn":\${this.lfn ? \`[\${this.lfn.map(x => \`\${x ? \`"\${x}"\` : null}\`).join(",")}]\` : null}}\`}`
        )
    })

    test('map', () => {
        const out = json_writer.forStruct([
            getField(
                1,
                'm',
                getMapValueType(getPrimitiveValueType('string'), getPrimitiveValueType('string'))
            ),
            getField(
                2,
                'mn',
                getMapValueType(
                    getPrimitiveValueType('string'),
                    getPrimitiveValueType('int64'),
                    true
                )
            ),
            getField(
                3,
                'mvn',
                getMapValueType(
                    getPrimitiveValueType('string'),
                    getPrimitiveValueType('string', true)
                )
            ),
            getField(
                4,
                'mfn',
                getMapValueType(
                    getPrimitiveValueType('string'),
                    getPrimitiveValueType('timestamp', true),
                    true
                )
            ),
        ])
        expect(out).toBe(
            `public override toJson(): string {return \`{"m":{\${Array.from(this.m, (([key, value]) => \`"\${key}":"\${value}"\`)).join(",")}},"mn":\${this.mn ? \`{\${Array.from(this.mn, (([key, value]) => \`"\${key}":"\${value}"\`)).join(",")}}\` : null},"mvn":{\${Array.from(this.mvn, (([key, value]) => \`"\${key}":\${value ? \`"\${value}"\` : null}\`)).join(",")}},"mfn":\${this.mfn ? \`{\${Array.from(this.mfn, (([key, value]) => \`"\${key}":\${value ? \`"\${value.toISOString()}"\` : null}\`)).join(",")}}\` : null}}\`}`
        )
    })
})
