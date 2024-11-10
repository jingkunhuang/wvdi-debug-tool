<template>
  <FileUploader />
  <div class="line-chart-wrapper">
    <LineChartCard />
    <LineChartCard />
    <LineChartCard />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LineChartCard from '../components/LineChartCard.vue'
import FileUploader from '@/components/FileUploader.vue'
</script>

<style></style>
