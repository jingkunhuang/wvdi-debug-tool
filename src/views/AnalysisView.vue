<template>
  <a-row :gutter="12">
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
        <FileUploader uploadText="Upload HVD logs" />
    </a-col>
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
        <FileUploader uploadText="Upload Thin-client logs" />
    </a-col>
  </a-row>


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
