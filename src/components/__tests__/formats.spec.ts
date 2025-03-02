import { describe, it, expect, vi } from 'vitest'
import { fN } from '../../helpers/format.ts'

describe('format fN', () => {
  it('numbers', () => {
    expect(`${fN(0)}:${fN(1)}:${fN(22)}:${fN(333)}`).toBe('00:01:22:333')
  })
  it('another arguments', () => {
    expect(`${fN(0, 'a')}:${fN(1, 'b', 4)}:${fN(22, 'c', 1)}:${fN(333, 'd', 4)}`).toBe('a0:bbb1:22:d333')
  })
})
