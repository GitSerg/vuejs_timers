<script setup lang="ts">
import { ref, type Ref } from 'vue'
import Timer from '../components/Timer.vue'

const timersArr: Ref<number[]> = ref(JSON.parse(localStorage.getItem('vue_timers_arr') || '[]') || [])
const isEditMode = ref(false)

function addTimer() {
  timersArr.value.push(0)
  localStorage.setItem('vue_timers_arr', JSON.stringify(timersArr.value))
}
function selectEditMode() {
  isEditMode.value = !isEditMode.value
}

</script>

<template>
  <div class="timers">
    <div class="center p-t-10">
      <label class="switch">
        <input type="checkbox" @change="selectEditMode">
        <span class="slider round"></span>
      </label>
    </div>

    <span class="nowrap" v-for="(item, i) in timersArr">{{ i }}:
      <Timer :index="i" :timers="timersArr" :isEditMode="isEditMode" />
    </span>
    <div class="center abs_bottom">
      <button class="btn_add_timer" @click="addTimer">addTimer</button>
    </div>
  </div>

</template>

<style>
@media (min-width: 1024px) {
  .timers {
    width: 70vw;
    min-height: 100vh;
    position: relative;
    /* display: flex;
    align-items: center; */
  }

  .p-t-10 {
    padding-top: 10px;
  }

  .nowrap {
    display: inline-block;
    white-space: nowrap;
  }

  .center {
    align-items: center;
    flex-direction: column;
    display: flex;
  }

  .abs_bottom {
    position: absolute;
    bottom: 100px;
    width: 100%;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked+.slider {
    background-color: #2196F3;
  }

  input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
}
</style>
