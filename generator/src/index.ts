#!/usr/bin/env node
import fs from 'fs';
import { parseSnapshot } from './models';
import { Generator } from './generator';

function main() {
    const args = process.argv.slice(2);
    const content = fs.readFileSync(process.stdin.fd, 'utf-8');
    const snapshot = parseSnapshot(content);

    const generator = new Generator(snapshot, {});
    generator.run();
}

main();