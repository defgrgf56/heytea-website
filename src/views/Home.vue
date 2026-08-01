<template>
  <div class="home">
    <!-- Hero区域 -->
    <HeroSlider />
  </div>
</template>

<script setup>
import HeroSlider from '@/components/HeroSlider.vue'
</script>

<style lang="scss" scoped>
.home {
  min-height: calc(100vh - 70px);
}
</style>
