<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Welcome</template>

    This is my first vue application. I use it for create many timers that will save in localStorage.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Click in header to "Timers" page.
    You will see button for add timer and select on top page to enter in edit mode.
    First add timer. Than enter to edit mode and change time to what you need. Enter timer title.
    Select again edit mode and push start button on the left of the timer. When timer end work it background-color will
    changed.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>


    README.md is available in
    <a href="javascript:void(0)" @click="openReadmeInEditor"><code>README.md</code></a>.
  </WelcomeItem>
</template>
