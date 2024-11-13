<template>
  <!-- todo: upload zip -->
  <!-- <FileUploader /> -->

  <a-row :gutter="12">
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
      <FileUploader ref="FileUploaderHvdRef" uploadText="Upload HVD logs" @onUpload="processFile" />
    </a-col>
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
      <FileUploader ref="FileUploaderTcRef" uploadText="Upload Thin-client logs" />
    </a-col>
  </a-row>

  <a-button type="primary" :loading="analyzeButtonLoading" @click="analyze">
    {{ analyzeButtonText }}
  </a-button>

  <p>{{ fileListHvdComputed }}</p>

  <a-divider />

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
import { computed } from 'vue';

function processFile(fileContent) {
  console.log('Processing file:', fileContent.length)
  message.success('file length: ' + fileContent.length)
}

const analyzeButtonLoading = ref(false);
const analyzeButtonText = ref('Analyze');

const FileUploaderHvdRef = ref(null)
const fileListTc = ref(null)

const fileListHvdComputed = computed(() => {
  return FileUploaderHvdRef.value?.uploadedFiles || []
})

function analyze() {
  analyzeButtonLoading.value = true;
  analyzeButtonText.value = 'Analyzing...';

  let fileUploaderHvd = fileListHvdComputed;

  for (let [key, value] of fileUploaderHvd) {
    console.log(key);
  }

  setTimeout(() => {
    analyzeButtonLoading.value = false;
    analyzeButtonText.value = 'Analyze';
  }, 3000);
}
</script>

<style></style>
