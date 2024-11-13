<template>
  <!-- todo: upload zip -->
  <!-- <FileUploader /> -->

  <a-row :gutter="12">
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
      <FileUploader uploadText="Upload HVD logs" @onUpdate="updateFileList($event,'hvd')" />
    </a-col>
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
      <FileUploader uploadText="Upload Thin-client logs" @onUpdate="updateFileList($event,'tc')" />
    </a-col>
  </a-row>

  <a-button type="primary" :loading="analyzeButtonLoading" @click="analyze">
    {{ analyzeButtonText }}
  </a-button>

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


var fileListHvd = []
var fileListTc = []

function updateFileList(fileList, type) {
  console.log(`update ${type} FileList:`, fileList.length)
  if (type === 'hvd') {
    fileListHvd = fileList
  } else if (type === 'tc') {
    fileListTc = fileList
  }
}

const analyzeButtonLoading = ref(false)
const analyzeButtonText = ref('Analyze')


function analyze() {
  analyzeButtonLoading.value = true
  analyzeButtonText.value = 'Analyzing...'

  const reader = new FileReader()
  reader.onload = (event) => {
    const fileContent = event.target.result
    const lines = fileContent.split('\n')
    message.success(`read ${lines.length} lines`)

    analyzeButtonLoading.value = false
    analyzeButtonText.value = 'Analyze'
  }

  reader.readAsText(fileListHvd[0])

  // setTimeout(() => {
  //   analyzeButtonLoading.value = false
  //   analyzeButtonText.value = 'Analyze'
  // }, 3000)
}
</script>

<style></style>
