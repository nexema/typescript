#!/usr/bin/env node
import fs from 'fs';

function main() {
    const content = fs.readFileSync(process.stdin.fd, 'utf-8');
    console.log(`This is the input: "${content.trim()}"`);
}

main();