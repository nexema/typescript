/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { NexemaPrimitiveValueType, NexemaValueType } from './models'

export function toCamelCase(input: string): string {
    return input
        .toLowerCase()
        .replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase())
}

export function toSnakeCase(input: string): string {
    return input.replace(/[A-Z]/g, (letter, index) => {
        return index == 0 ? letter.toLowerCase() : '_' + letter.toLowerCase()
    })
}

export function writeDocumentation(comments: string[]): string {
    if (comments.length === 0) {
        return ''
    }

    return `/**
    ${comments.map((x) => `* ${x}`).join('\n')}
    */`
}

export function isJsPrimitive(valueType: NexemaValueType): boolean {
    if (valueType.kind === 'primitiveValueType') {
        switch ((valueType as NexemaPrimitiveValueType).primitive) {
            case 'binary':
            case 'timestamp':
            case 'list':
            case 'map':
                return false

            default:
                return true
        }
    } else {
        return false
    }
}
