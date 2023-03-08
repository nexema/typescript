export function toCamelCase(input: string): string {
    return input
        .toLowerCase()
        .replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase())
}
