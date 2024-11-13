<template>
  <FileUploader />
  <!-- <a-row :gutter="12">
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
      <FileUploader uploadText="Upload HVD logs" @onUpload="processFile" />
    </a-col>
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
      <FileUploader uploadText="Upload Thin-client logs" />
    </a-col>
  </a-row> -->

  <a-flex :vertical="false">
    <a-card size="small" bordered="false">
      <FileUploader uploadText="Upload HVD logs" @onUpload="processFile" />
    </a-card>
    <a-card size="small" bordered="false">
      <FileUploader uploadText="Upload Thin-client logs" />
    </a-card>
  </a-flex>

  <div class="line-chart-wrapper">
    <LineChartCard />
    <LineChartCard />
    <LineChartCard />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import LineChartCard from '../components/LineChartCard.vue'
import FileUploader from '@/components/FileUploader.vue'

function processFile(fileContent) {
  console.log('Processing file:', fileContent.length)
  message.success('file length: ' + fileContent.length)
}
</script>

<style></style>
