import prettier from 'prettier';
import { PrettierSettings } from '../src/constants';

export function formatSource(input: string): string {
    return prettier.format(input, PrettierSettings);
}