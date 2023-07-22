import { exec } from 'child_process'
import fs from 'fs'
import * as p from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
exec('cat ./example/snapshot.nexs | npm run exec -- --output-path=./example/src', (err, stdout) => {
    if (err) {
        console.error(err)
    } else {
        const data = JSON.parse(stdout.substring(stdout.indexOf('{')).trim())['files']
        for (const file of data) {
            const path = p.join('./example/src', file['filePath'])
            fs.mkdirSync(p.dirname(path), { recursive: true })
            fs.writeFileSync(`${path}.ts`, file['contents'])
        }
    }
})
