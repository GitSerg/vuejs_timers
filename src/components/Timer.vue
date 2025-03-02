<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { fN } from '@/helpers/format'
import { TimerModel } from '@/models/Timer'

const props = defineProps(['index', 'timers', 'isEditMode'])
const TimerModelInstance = new TimerModel(props.index)

const refTimer = ref(TimerModelInstance.howManyWait)
const timerTitle = ref(TimerModelInstance.title)
const isStart: Ref<boolean> = ref(false)
const timerActive = computed(() => refTimer.value.hour > 0 || refTimer.value.minutes > 0 || refTimer.value.seconds > 0)

let needRefresh = false
let interval: number

function onClickRemoveTimer() {
    props.timers.splice(props.index, 1)
    TimerModelInstance.clearLS()
    localStorage.setItem('vue_timers_arr', JSON.stringify(props.timers))
}
function onClickRefresh() {
    onClickPause()
    TimerModelInstance.setLeftToWait()
    onClickStart()
}
function onClickPause() {
    refTimer.value = TimerModelInstance.getTimeRender()
    if (!isStart.value) {
        return
    }
    if (interval) {
        clearInterval(interval)
    }
    TimerModelInstance.saveHowManyLeft()
    isStart.value = false
}
function onClickStart() {
    if (isStart.value) {
        return
    }
    isStart.value = true
    TimerModelInstance.loadHowManyLeft()
    interval = setInterval(() => {
        if (needRefresh) {
            needRefresh = false
            onClickRefresh()
            return
        }
        refTimer.value = TimerModelInstance.getTimeRender()
        if (!timerActive.value) {
            onClickPause()
        }
    }, 1000)
}
function changeEventCreator(field: 'hour' | 'minutes' | 'seconds') {
    return function (event: Event) {
        TimerModelInstance.changeTime(field, (event.target as HTMLInputElement).value)
        needRefresh = true
    }
}
const onChangeHour = changeEventCreator('hour')
const onChangeMinutes = changeEventCreator('minutes')
const onChangeSec = changeEventCreator('seconds')
function onChangeTimerTitle(event: Event) {
    TimerModelInstance.title = (event.target as HTMLInputElement).value
    timerTitle.value = TimerModelInstance.title
}
</script>

<template>
    <div v-if="!isEditMode" class="block" :class="{ red_back: !timerActive }">
        <p>{{ timerTitle }}</p>
        <!-- 行く [iku] - go -->
        <button @click="onClickStart" title="start" :class="{ gray: isStart, blue: !isStart }"> 行く </button>
        <!-- 二 [ni] - 2 but visual simply like stop -->
        <button @click="onClickPause" title="pause" :class="{ gray: !isStart, blue: isStart }"> 二 </button>
        {{ fN(refTimer.hour) }}:{{ fN(refTimer.minutes) }}:{{ fN(refTimer.seconds) }}
        <!-- 新た [arata] - new, but shorter record. (新しい [atarashi] - new) -->
        <button @click="onClickRefresh" title="refresh"> 新た </button>
    </div>
    <div v-if="isEditMode" class="block">
        <input id="change_title_input" type="text" @change="onChangeTimerTitle" :value="timerTitle" class="timer_title">
        <input id="change_title_hour" type="number" min="0" max="24" :value="TimerModelInstance.howManyWait.hour"
            @change="onChangeHour">
        <input id="change_title_minutes" type="number" min="0" max="60" :value="TimerModelInstance.howManyWait.minutes"
            @change="onChangeMinutes">
        <input id="change_title_seconds" type="number" min="0" max="60" :value="TimerModelInstance.howManyWait.seconds"
            @change="onChangeSec">
        <button @click="onClickRemoveTimer" class="red"> X </button>
    </div>
</template>

<style scoped>
.block {
    display: inline-block;
    padding: 0px 10px 10px;
    width: 220px;
    font-size: 20px;
    border: 1px solid rgb(185, 177, 177);
    border-radius: 10px;
    margin: 2px;
}

.timer_title {
    display: block;
    font-size: 16px;
    margin-bottom: 7px;
}

.blue {
    background-color: rgb(145, 145, 230);
    cursor: pointer;
    border: 0;
    border-bottom: 1px solid rgb(145, 145, 230);
}

.blue:hover {
    background-color: rgb(161, 161, 212);
}

.gray {
    pointer-events: none;
    background-color: rgb(92, 92, 92);
    color: rgb(190, 190, 190);
    border: 0;
    border-bottom: 1px solid rgb(92, 92, 92);
}

.red {
    color: rgb(177, 60, 60);
}

.red_back {
    background-color: rgb(219, 105, 105);
}
</style>