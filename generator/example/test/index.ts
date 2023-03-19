/* eslint-disable @typescript-eslint/no-explicit-any */
import { NexemabReader } from 'nexema'
import { Bar, Foo } from '../src/root/a.nex'
import { Baz } from '../src/root/b.nex'
import { Abc } from '../src/root/foo/c.nex'

runAll()

function runAll() {
    readRaw()
    testEncoding()
}

function testEncoding() {
    assert('Bar.blue.encode()', Bar.blue.encode(), new Uint8Array([2]))
    assert(
        'Foo.encode()',
        new Foo({
            a: 'hello world',
            b: Bar.blue,
            c: Baz.two,
            d: new Abc({
                y: ['first', 'second', 'last'],
            }),
        }).encode(),
        new Uint8Array([
            22, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 2, 2, 42, 0, 220, 6, 10, 102,
            105, 114, 115, 116, 12, 115, 101, 99, 111, 110, 100, 8, 108, 97, 115, 116,
        ])
    )
    assert(
        'Foo.decode',
        Foo.decode(
            new Uint8Array([
                22, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 2, 2, 42, 0, 220, 6, 10,
                102, 105, 114, 115, 116, 12, 115, 101, 99, 111, 110, 100, 8, 108, 97, 115, 116,
            ])
        ),
        new Foo({
            a: 'hello world',
            b: Bar.blue,
            c: Baz.two,
            d: new Abc({
                y: ['first', 'second', 'last'],
            }),
        }),
        (a: Foo, b: Foo) => a.equals(b)
    )
}

function readRaw() {
    const buffer = new Uint8Array([
        22, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 2, 2, 42, 0, 220, 6, 10, 102, 105,
        114, 115, 116, 12, 115, 101, 99, 111, 110, 100, 8, 108, 97, 115, 116,
    ])
    const reader = new NexemabReader(buffer)
    assert('decodeString', reader.decodeString(), 'hello world')
    assert('decodeBar', Bar.byIndex(reader.decodeUint8()) ?? Bar.unspecified, Bar.blue)
    assert('decodeBaz', Baz.byIndex(reader.decodeUint8()) ?? Baz.unknown, Baz.two)

    assert(
        'decodeAbc',
        new Abc({ y: ['first', 'second', 'last'] }),
        Abc.decode(reader.decodeBinary()),
        (a: Abc, b: Abc) => a.equals(b)
    )
}

function assert(name: string, a: any, b: any, fn?: (a: any, b: any) => boolean): void {
    if (fn) {
        if (!fn(a, b)) {
            throw `${name}: ${a} is not equal to ${b}`
        } else {
            return
        }
    }

    a = JSON.stringify(a)
    b = JSON.stringify(b)
    if (a !== b) {
        throw `${name}: ${a} is not equal to ${b}`
    }
}
