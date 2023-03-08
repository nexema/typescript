import prettier from 'prettier'

export const ImportAlias = {
    Nexema: '$nex',
}

export const PrettierSettings: prettier.Options = {
    arrowParens: 'always',
    bracketSameLine: true,
    parser: 'typescript',
    quoteProps: 'preserve',
}
