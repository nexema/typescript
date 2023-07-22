#!/usr/bin/env node
import fs from 'fs'
import { NexemaSnapshot, PluginResult, parseSnapshot } from './models'
import { Generator } from './generator'

function main() {
    const args = new Map(
        process.argv
            .slice(2)
            .map((x) => x.split('='))
            .map((x) => [x[0], x[1]])
    )
    let content: string
    try {
        content = fs.readFileSync(process.stdin.fd, 'utf-8')
    } catch (err) {
        out({
            exitCode: 401,
            error: 'no-stdin-to-read',
        })
        return
    }

    let snapshot: NexemaSnapshot
    try {
        snapshot = parseSnapshot(content)
    } catch (err) {
        out({
            exitCode: 400,
            error: 'invalid-snapshot',
        })
        return
    }

    const outputPath = args.get('--output-path')
    if (!outputPath) {
        out({
            exitCode: 400,
            error: 'missing-output-path',
        })
        return
    }

    const generator = new Generator(snapshot, {
        outputPath: outputPath,
        useOnlyMaps: true,
    })
    const result = generator.run()
    if (result.exitCode) {
        out({
            exitCode: result.exitCode,
            error: result.error,
        })
        return
    }

    out({
        exitCode: 0,
        files: result.files,
    })
}

function out(content: PluginResult): void {
    process.stdout.write(`${JSON.stringify(content)}\n`)
}

main()
