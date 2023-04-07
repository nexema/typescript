#!/usr/bin/env node
import fs from 'fs'
import { NexemaSnapshot, parseSnapshot } from './models'
import { Generator } from './generator'

function main() {
    const args = new Map(
        process.argv
            .slice(2)
            .map((x) => x.split('='))
            .map((x) => [x[0], x[1]])
    )
    const content = fs.readFileSync(process.stdin.fd, 'utf-8')
    let snapshot: NexemaSnapshot
    try {
        snapshot = parseSnapshot(content)
    } catch (err) {
        out('{"error":"error-invalid-snapshot"}')
        return
    }

    const outputPath = args.get('output-path')
    if (!outputPath) {
        out('{"error":"missing-output-path"}')
        return
    }

    const generator = new Generator(snapshot, {
        outputPath: outputPath,
        useOnlyMaps: true,
    })
    const result = generator.run()
    if (result.exitCode) {
        out(`{"error":"error-${result.exitCode}"}`)
        return
    }

    out(JSON.stringify(result.files))
}

function out(content: string): void {
    process.stdout.write(`${content}\n`)
}

main()
