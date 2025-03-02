import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Timer from '../Timer.vue'

describe('Timer', () => {
  it('default render', () => {
    const wrapper = mount(Timer, { props: { index: 3, timers: [], isEditMode: false } })
    expect(wrapper.text()).toContain('Timer title')
    expect(wrapper.text()).toContain('新た')
  })
  it('timer worked', async () => {
    vi.useFakeTimers()
    const FAKE_CURRENT_DATE = new Date(2025, 2, 2, 15, 47, 0)
    const dAfter10min = new Date(FAKE_CURRENT_DATE)
    dAfter10min.setMinutes(dAfter10min.getMinutes() + 10)
    vi.setSystemTime(FAKE_CURRENT_DATE)
    const wrapper = mount(Timer, { props: { index: 2, timers: [], isEditMode: false } })
    await wrapper.find('button[title="start"]').trigger('click')
    vi.setSystemTime(dAfter10min)
    await wrapper.find('button[title="pause"]').trigger('click')
    expect(wrapper.text()).toContain('0:50:00')
    vi.useRealTimers()
  })
  it('edit mode changed', () => {
    const wrapper = mount(Timer, { props: { index: 1, timers: [], isEditMode: true } })
    expect(wrapper.text()).toContain('X')
  })
  it('hour edited', async () => {
    const wrapper = mount(Timer, { props: { index: 0, timers: [], isEditMode: true } })
    const TEST_TITLE = 'Test title'
    await wrapper.find('input#change_title_input').setValue(TEST_TITLE)
    await wrapper.setProps({ isEditMode: false })
    expect(wrapper.text()).toContain(TEST_TITLE)
  })
})
