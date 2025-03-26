<template>
  <!-- todo: upload zip -->
  <!-- <FileUploader /> -->

  <a-row :gutter="12">
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
      <FileUploader uploadText="Upload HVD logs" @onUpdate="updateFileList($event,'hvd')" />
    </a-col>
    <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
      <FileUploader uploadText="[todo] Upload Thin-client logs" @onUpdate="updateFileList($event,'tc')" />
    </a-col>
  </a-row>

  <a-button type="primary" :loading="analyzeButtonLoading" @click="analyze">
    {{ analyzeButtonText }}
  </a-button>
  <a-slider v-model:value="dateSliderValue" range @afterChange="onAfterDateSliderChange" />
  <a-space>
      <!-- <a-range-picker v-model:value="datePickerValue" show-time /> -->
      <a-button type="primary" @click="onFilterToTime">Filter to Time</a-button>
      <a-button type="primary" @click="dateSliderValue=[0, 100]">Reset</a-button>
  </a-space>

  <a-divider />

  <a-flex gap="middle" vertical>
    <GChart v-for="(graph, index) in logGraphDataList" :key="index" :type="graph.type" :data="graph.data" :options="graph.options" :settings="graph.settings" />
  </a-flex>

  <a-divider />
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { GChart } from 'vue-google-charts'
import FileUploader from '@/components/FileUploader.vue'
import { readFilesAsync } from '@/utils/fileUtils'
import { getLogTime, getLogTimeRange, filterToTimeRange } from '@/utils/logUtils'

import log_graphs from '@/logVisualize'

var fileListHvd = []
var fileListTc = []

var logHvd = {
  main: [],
  vc: [],
}

var logTc = {
  main: [],
  vc: [],
}

function updateFileList(fileList, type) {
  console.log(`update ${type} FileList:`, fileList.length)
  if (type === 'hvd') {
    fileListHvd = fileList
    logHvd.main = fileList.filter((file) => file.name.includes('current'))
    logHvd.vc = fileList.filter((file) => file.name.includes('VirtualChannel'))
  } else if (type === 'tc') {
    fileListTc = fileList
    logTc.main = fileList.filter((file) => file.name.includes('current'))
    logTc.vc = fileList.filter((file) => file.name.includes('VirtualChannel'))
  }
}

const analyzeButtonLoading = ref(false)
const analyzeButtonText = ref('Analyze')

const dateSliderValue = ref([0, 100])
const datePickerValue = ref()

var mergedHvdLogs = []
var hvdLogsTimeRange = []

function onAfterDateSliderChange(value) {
  console.log('onAfterDateSliderChange:', value)
}

function onFilterToTime() {
  if (hvdLogsTimeRange.length === 2 && hvdLogsTimeRange[0] && hvdLogsTimeRange[1]) {
    const startTime = hvdLogsTimeRange[0].valueOf();
    const endTime = hvdLogsTimeRange[1].valueOf();
    const interval = endTime - startTime;

    const newStart = startTime + interval * dateSliderValue.value[0] / 100;
    const newEnd = startTime + interval * dateSliderValue.value[1] / 100;

    const filteredHvdLogs = filterToTimeRange(mergedHvdLogs, new Date(newStart), new Date(newEnd));

    logGraphDataList.value = []
    log_graphs.forEach((graph) => {
        const graphData = graph.process(filteredHvdLogs)
        if (graphData.data.length > 1) {
          logGraphDataList.value.push(graphData)
        }
      })


  }
}

// merge log files, order by timestamp
function mergeLogFiles(files) {
  const logs = files.map((file) => file.split('\n'))
  logs.sort((a, b) => {
    const timeA = getLogTime(a[0])
    const timeB = getLogTime(b[0])
    // show error if time is not found
    if (!timeA || !timeB) {
      console.error('Time not found in log file')
      message.error('Time not found in log file')
      return []
    }
    return timeA - timeB
  })

  return logs.flat()
}


const logGraphDataList = ref([])

function analyze() {
  analyzeButtonLoading.value = true
  analyzeButtonText.value = 'Analyzing...'

  logGraphDataList.value = []
  dateSliderValue.value = [0, 100]

  readFilesAsync(logHvd.main)
    .then((hvdLogs) => {
      console.log('hvdLogs:', hvdLogs.length)
      mergedHvdLogs = mergeLogFiles(hvdLogs)
      console.log('mergedHvdLogs:', mergedHvdLogs.length)
      message.success(`Read ${mergedHvdLogs.length} line HVD logs`)

      hvdLogsTimeRange = getLogTimeRange(mergedHvdLogs)
      message.success(`HVD logs time range: ${hvdLogsTimeRange[0]} - ${hvdLogsTimeRange[1]}`)

      log_graphs.forEach((graph) => {
        const graphData = graph.process(mergedHvdLogs)
        if (graphData.data.length > 1) {
          logGraphDataList.value.push(graphData)
        }
      })

      analyzeButtonLoading.value = false
      analyzeButtonText.value = 'Analyze'

    })
    .catch((error) => {
      console.error('Error reading HVD logs:', error)
      message.error('Error reading HVD logs')

      analyzeButtonLoading.value = false
      analyzeButtonText.value = 'Analyze'
    })

}

</script>

<style></style>
