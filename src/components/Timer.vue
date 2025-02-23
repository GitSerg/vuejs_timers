<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'

const props = defineProps(['index', 'timers', 'isEditMode'])
const timer_name = `vue_timer_${props.index}`
function getLS(field: string) {
    return localStorage.getItem(`${timer_name}_${field}`)
}
function getHMWFromLS(field: string) {
    return parseInt(getLS(`hmw_${field}`) || '', 10)
}
const howManyWait = {
    hour: getHMWFromLS('hour') || 1,
    minutes: getHMWFromLS('minutes') || 0,
    seconds: getHMWFromLS('seconds') || 0,
}
const howManyLeft = { ...howManyWait }
const startDate = new Date()
const targetTime = new Date(startDate)

const refTimer = ref(howManyWait)
const timerTitle = ref(getLS('timer_title') || 'Timer title')
const isStart: Ref<boolean> = ref(false)
const timerActive = computed(() => refTimer.value.hour > 0 || refTimer.value.minutes > 0 || refTimer.value.seconds > 0)

let needRefresh = false
let interval: number

targetTime.setHours(targetTime.getHours() + 1)

function removeTimer() {
    props.timers.splice(props.index, 1)
    localStorage.removeItem(`${timer_name}_timer_title`)
    localStorage.removeItem(`${timer_name}_hmw_hour`)
    localStorage.removeItem(`${timer_name}_hmw_minutes`)
    localStorage.removeItem(`${timer_name}_hmw_seconds`)
}
function refresh() {
    pause()
    howManyLeft.hour = howManyWait.hour
    howManyLeft.minutes = howManyWait.minutes
    howManyLeft.seconds = howManyWait.seconds
    start()
}
function pause() {
    if (!isStart.value) {
        return
    }
    if (interval) {
        clearInterval(interval)
    }
    const currentDate = new Date()
    howManyLeft.hour = targetTime.getHours() - currentDate.getHours()
    howManyLeft.minutes = targetTime.getMinutes() - currentDate.getMinutes()
    howManyLeft.seconds = targetTime.getSeconds() - currentDate.getSeconds()
    isStart.value = false
}
function start() {
    if (isStart.value) {
        return
    }
    if (!timerActive) {
        refresh()
    }
    isStart.value = true
    const currentDate = new Date()
    targetTime.setHours(currentDate.getHours() + howManyLeft.hour)
    targetTime.setMinutes(currentDate.getMinutes() + howManyLeft.minutes)
    targetTime.setSeconds(currentDate.getSeconds() + howManyLeft.seconds)
    interval = setInterval(() => {
        if (!timerActive) {
            pause()
        }
        if (needRefresh) {
            needRefresh = false
            refresh()
            return
        }
        const now = (targetTime.getTime() - Date.now()) / 1000
        refTimer.value = {
            hour: Math.floor(now / 3600),
            minutes: Math.floor(now / 60 % 60),
            seconds: Math.floor(now % 60),
        }
    }, 1000)
}
function changeEventCreator(field: 'hour' | 'minutes' | 'seconds') {
    return function (event: Event) {
        howManyWait[field] = parseInt((event.target as HTMLInputElement).value, 10)
        localStorage.setItem(`${timer_name}_hmw_${field}`, String(howManyWait[field]))
        needRefresh = true
    }
}
const onChangeHour = changeEventCreator('hour')
const onChangeMinutes = changeEventCreator('minutes')
const onChangeSec = changeEventCreator('seconds')
function onChangeTimerTitle(event: Event) {
    timerTitle.value = String((event.target as HTMLInputElement).value).trim()
    localStorage.setItem(`${timer_name}_timer_title`, timerTitle.value)
}
function fN(n: number) {
    return String(n).padStart(2, '0')
}
</script>

<template>
    <div v-if="!isEditMode" class="block" :class="{ red_back: !timerActive }">
        <p>{{ timerTitle }}</p>
        <button @click="start" title="start" :class="{ gray: isStart, blue: !isStart }"> play </button>
        <button @click="pause" title="pause" :class="{ gray: !isStart, blue: isStart }"> 二 </button>
        {{ fN(refTimer.hour) }}:{{ fN(refTimer.minutes) }}:{{ fN(refTimer.seconds) }}
        <button @click="removeTimer" class="red"> X </button>
    </div>
    <div v-if="isEditMode" class="block">
        <input type="text" @change="onChangeTimerTitle" :value="timerTitle" class="timer_title">
        <input type="number" min="0" max="24" :value="howManyWait.hour" @change="onChangeHour">
        <input type="number" min="0" max="60" :value="howManyWait.minutes" @change="onChangeMinutes">
        <input type="number" min="0" max="60" :value="howManyWait.seconds" @change="onChangeSec">
    </div>
</template>

<style scoped>
.block {
    display: inline-block;
    padding: 5px 10px;
    width: 200px;
    font-size: 20px;
}

.timer_title {
    display: block;
    font-size: 16px;
    margin-bottom: 7px;
}

.blue {
    background-color: rgb(85, 85, 165);
    cursor: pointer;
}

.gray {
    pointer-events: none;
    background-color: gray;
}

.red {
    color: rgb(177, 60, 60);
}

.red_back {
    background-color: brown;
}
</style>