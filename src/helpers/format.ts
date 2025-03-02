/**
 * Format number for time output
 * @param value - number for formating
 * @param letter - what we adding at empty place
 * @param n - how long string must be
 */
export function fN(value: number, letter: string = '0', n: number = 2): string {
    return String(value).padStart(n, letter)
}