import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { TimerModel } from '../../models/Timer.ts'

const FAKE_CURRENT_DATE = new Date(2025, 2, 2, 15, 47, 0)
const dAfter1Hour = new Date(FAKE_CURRENT_DATE)
dAfter1Hour.setHours(dAfter1Hour.getHours() + 1)
const dAfter10min = new Date(FAKE_CURRENT_DATE)
dAfter10min.setMinutes(dAfter10min.getMinutes() + 10)
const dAfter20min = new Date(FAKE_CURRENT_DATE)
dAfter20min.setMinutes(dAfter20min.getMinutes() + 20)

describe('TimerModel', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })
  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })
  it('constructor', () => {
    vi.setSystemTime(FAKE_CURRENT_DATE)
    const instance = new TimerModel(14)
    expect(instance.name).toBe('vue_timer_14')
    expect(instance.dStart).toEqual(FAKE_CURRENT_DATE)
    expect(instance.dTarget).toEqual(dAfter1Hour)
    expect(instance.howManyLeft).toEqual({ hour: 1, minutes: 0, seconds: 0 })
    expect(instance.howManyWait).toEqual({ hour: 1, minutes: 0, seconds: 0 })
  })
  it('title getter', () => {
    const DEFAULT_TITLE = 'Timer title'
    const TEST_TITLE = 'Test title'
    const instance = new TimerModel(12)
    expect(instance.title).toBe(DEFAULT_TITLE)
    instance.title = TEST_TITLE
    expect(instance.title).toBe(TEST_TITLE)
  })
  it('save and load howManyLeft', () => {
    vi.setSystemTime(FAKE_CURRENT_DATE)
    const instance = new TimerModel(10)
    expect(instance.howManyLeft).toEqual({ hour: 1, minutes: 0, seconds: 0 })
    expect(instance.howManyWait).toEqual({ hour: 1, minutes: 0, seconds: 0 })
    vi.setSystemTime(dAfter10min)
    instance.saveHowManyLeft()
    expect(instance.howManyLeft).toEqual({ hour: 1, minutes: -10, seconds: 0 })
    expect(instance.howManyWait).toEqual({ hour: 1, minutes: 0, seconds: 0 })
    vi.setSystemTime(dAfter20min)
    instance.loadHowManyLeft()
    const dNewTarget = new Date(dAfter20min)
    dNewTarget.setMinutes(dAfter20min.getMinutes() + 50)
    expect(instance.dTarget).toEqual(dNewTarget)
  })
  it('save and load howManyLeft at evening in 23 hours', () => {
    const CURRENT_23_DATE = new Date(2025, 2, 2, 23, 47, 0)
    vi.setSystemTime(CURRENT_23_DATE)
    const instance = new TimerModel(9)
    expect(instance.howManyLeft).toEqual({ hour: 1, minutes: 0, seconds: 0 })
    expect(instance.howManyWait).toEqual({ hour: 1, minutes: 0, seconds: 0 })
    const d23After10min = new Date(CURRENT_23_DATE)
    d23After10min.setMinutes(d23After10min.getMinutes() + 10)
    vi.setSystemTime(d23After10min)
    instance.saveHowManyLeft()
    expect(instance.howManyLeft).toEqual({ hour: 1, minutes: -10, seconds: 0 })
    expect(instance.howManyWait).toEqual({ hour: 1, minutes: 0, seconds: 0 })
    const d23After20min = new Date(d23After10min)
    d23After20min.setMinutes(d23After20min.getMinutes() + 10)
    vi.setSystemTime(d23After20min)
    instance.loadHowManyLeft()
    const dNewTarget = new Date(d23After20min)
    dNewTarget.setMinutes(d23After20min.getMinutes() + 50)
    expect(instance.dTarget).toEqual(dNewTarget)
  })
  it('changeTime', () => {
    vi.setSystemTime(FAKE_CURRENT_DATE)
    const instance = new TimerModel(8)
    instance.changeTime('hour', '3')
    expect(instance.howManyWait.hour).toBe(3)
    instance.changeTime('minutes', '55')
    expect(instance.howManyWait.minutes).toBe(55)
    instance.changeTime('seconds', '7')
    expect(instance.howManyWait.seconds).toBe(7)
  })
  it('getTimeRender', () => {
    vi.setSystemTime(FAKE_CURRENT_DATE)
    const instance = new TimerModel(7)
    expect(instance.getTimeRender()).toEqual({ 
        hour: 1, 
        minutes: 0, 
        seconds: 0 
    })
    vi.setSystemTime(dAfter10min)
    expect(instance.getTimeRender()).toEqual({ 
        hour: 0, 
        minutes: 50, 
        seconds: 0 
    })
  })
})
