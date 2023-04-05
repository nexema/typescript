export const NexemajSpec = {
  ObjectStart: 0x7b,
  ObjectEnd: 0x7d,
  ArrayStart: 0x5b,
  ArrayEnd: 0x5d,
  Comma: 0x2c,
  Quotes: 0x22,
  Colon: 0x3a,
  Backlash: 0x5c,
  Newline: 0x0a,
  Carriage: 0x0d,
  Tab: 0x09,
  Space: 0x20,
  LetterN: 0x6e,
  LetterT: 0x74,
  LetterR: 0x72,
  LetterF: 0x66,
  BooleanFalse: new Uint8Array([0x66, 0x61, 0x6c, 0x73, 0x65]),
  BooleanTrue: new Uint8Array([0x74, 0x72, 0x75, 0x65]),
  Null: new Uint8Array([0x6e, 0x75, 0x6c, 0x6c]),
} as const;

export const Limits = {
  OneByte: 0x80,
  TwoBytes: 0x800,
  ThreeBytesLower: 0xd800,
  ThreeBytesUpper: 0xe000,
} as const;

export enum TokenType {
  INVALID = -1,
  IDENT = 0,
  COMMA = 1,
  COLON = 2,
  QUOTE = 3,
  ARRAY_START = 4,
  ARRAY_END = 5,
  OBJECT_START = 6,
  OBJECT_END = 7,
}

export enum JsonType {
  NULL,
  BOOLEAN_TRUE,
  BOOLEAN_FALSE,
  STRING,
  NUMBER,
  ARRAY,
  OBJECT,
}

export const EscapeSequences = {
  34: "",
} as const;

export const replacements = {
  [NexemajSpec.Quotes]: [NexemajSpec.Backlash, NexemajSpec.Quotes],
  [NexemajSpec.Backlash]: [NexemajSpec.Backlash, NexemajSpec.Backlash],
  [NexemajSpec.Newline]: [NexemajSpec.Backlash, NexemajSpec.LetterN],
  [NexemajSpec.Carriage]: [NexemajSpec.Backlash, NexemajSpec.LetterR],
  [NexemajSpec.Tab]: [NexemajSpec.Backlash, NexemajSpec.LetterT],
} as any;
