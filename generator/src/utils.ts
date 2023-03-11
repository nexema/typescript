export function toCamelCase(input: string): string {
    return input
        .toLowerCase()
        .replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase())
}

export function writeDocumentation(comments: string[]): string {
    if (comments.length === 0) {
        return ''
    }

    return `/**
    ${comments.map((x) => `* ${x}`).join('\n')}
    */`
}
