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

  <a-checkbox v-model:checked="useglobalTimeRange">sync time</a-checkbox>

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

  <a-divider orientation="left">HVD main</a-divider>

  <a-flex gap="middle" vertical>
    <GChart v-for="(graph, index) in logGraphDataList_hvd_main" :key="index" :type="graph.type" :data="graph.data" :options="graph.options" :settings="graph.settings" />
  </a-flex>

  <a-divider orientation="left">Thin-client main</a-divider>

  <a-flex gap="middle" vertical>
    <GChart v-for="(graph, index) in logGraphDataList_tc_main" :key="index" :type="graph.type" :data="graph.data" :options="graph.options" :settings="graph.settings" />
  </a-flex>

  <a-divider orientation="left">HVD vc</a-divider>

  <a-flex gap="middle" vertical>
    <GChart v-for="(graph, index) in logGraphDataList_hvd_vc" :key="index" :type="graph.type" :data="graph.data" :options="graph.options" :settings="graph.settings" />
  </a-flex>

  <a-divider orientation="left">Thin-client vc</a-divider>

  <a-flex gap="middle" vertical>
    <GChart v-for="(graph, index) in logGraphDataList_tc_vc" :key="index" :type="graph.type" :data="graph.data" :options="graph.options" :settings="graph.settings" />
  </a-flex>

  <a-divider />
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { GChart } from 'vue-google-charts'
import FileUploader from '@/components/FileUploader.vue'
import { getLogTimeRange, filterToTimeRange, readLogFiles } from '@/utils/logUtils'
import { log_graphs_hvd_main, log_graphs_hvd_vc, log_graphs_tc_main, log_graphs_tc_vc } from '@/logVisualize';

var logFileHvd = {
  main: [],
  vc: [],
}

var logFileTc = {
  main: [],
  vc: [],
}

var logLinesHvd = {
  main: [],
  vc: [],
}

var logLinesTc = {
  main: [],
  vc: [],
}



function updateFileList(fileList, type) {
  console.log(`update ${type} FileList:`, fileList.length)
  const logTypeMap = {
    hvd: logFileHvd,
    tc: logFileTc,
  }

  if (logTypeMap[type]) {
    logTypeMap[type].main = fileList.filter((file) => file.name.includes('current'))
    logTypeMap[type].vc = fileList.filter((file) => file.name.includes('VirtualChannel'))
  } else {
    console.warn(`Unknown log type: ${type}`)
  }
}

const analyzeButtonLoading = ref(false)
const analyzeButtonText = ref('Analyze')

const useglobalTimeRange = ref(true);

var globalTimeRange = []

var globalOptions = {
    timeRange: globalTimeRange,
  }

const dateSliderValue = ref([0, 100])
const datePickerValue = ref()

function onAfterDateSliderChange(value) {
  console.log('onAfterDateSliderChange:', value)
}

function calculateFilteredTimeRange(timeRange) {
  const startTime = timeRange[0].valueOf()
  const endTime = timeRange[1].valueOf()
  const interval = endTime - startTime

  const newStart = startTime + interval * dateSliderValue.value[0] / 100
  const newEnd = startTime + interval * dateSliderValue.value[1] / 100

  return [new Date(newStart), new Date(newEnd)]
}

function onFilterToTime() {
  updateGlobalTimeRange()

  renderGraphs(logLinesHvd.main, log_graphs_hvd_main, logGraphDataList_hvd_main, true)
  renderGraphs(logLinesHvd.vc, log_graphs_hvd_vc, logGraphDataList_hvd_vc, true)
  renderGraphs(logLinesTc.main, log_graphs_tc_main, logGraphDataList_tc_main, true)
  renderGraphs(logLinesTc.vc, log_graphs_tc_vc, logGraphDataList_tc_vc, true)
}


const logGraphDataList_hvd_main = ref([])
const logGraphDataList_hvd_vc = ref([])
const logGraphDataList_tc_main = ref([])
const logGraphDataList_tc_vc = ref([])

function readLogFile() {
  // readLogFiles from logFileHvd and logFileTc and store in logLinesHvd and logLinesTc

  return new Promise((resolve, reject) => {
    var logList = [logFileHvd.main, logFileHvd.vc, logFileTc.main, logFileTc.vc]

    Promise.all(logList.map((logFiles) => {
      return readLogFiles(logFiles)
    }))
      .then((logLines) => {
        logLinesHvd.main = logLines[0]
        logLinesHvd.vc = logLines[1]
        logLinesTc.main = logLines[2]
        logLinesTc.vc = logLines[3]

        resolve()
      })
      .catch((error) => {
        console.error('Error reading log files:', error)
        reject(error)
      })

  })
}

function renderGraphs(logLines, graphs, target, filterByTime) {
  // return if no log lines or no graphs
  if (!logLines || logLines.length === 0 || !graphs || graphs.length === 0) return

  target.value = []

  var logs = logLines

  if (useglobalTimeRange.value) {
    if (globalTimeRange.length > 0) {
      logs = filterToTimeRange(logLines, globalTimeRange[0], globalTimeRange[1])
    }
  }
  else if (filterByTime) {
    const logsTimeRange = getLogTimeRange(logs)
    const newTimeRange = calculateFilteredTimeRange(logsTimeRange)
    logs = filterToTimeRange(logs, newTimeRange[0], newTimeRange[1])
  }

  graphs.forEach((graph) => {
    const graphData = graph.process(logs, globalOptions)
    if (graphData.data.length > 1) {
      target.value.push(graphData)
    }
  })

}

function updateGlobalTimeRange() {
  if (logLinesHvd.main.length > 0 && useglobalTimeRange.value) {
    globalTimeRange = getLogTimeRange(logLinesHvd.main)
    globalTimeRange = calculateFilteredTimeRange(globalTimeRange)
    globalOptions.timeRange = globalTimeRange
  }
}

function analyze() {
  analyzeButtonLoading.value = true
  analyzeButtonText.value = 'Analyzing...'

  logGraphDataList_hvd_main.value = []
  logGraphDataList_hvd_vc.value = []
  logGraphDataList_tc_main.value = []
  logGraphDataList_tc_vc.value = []
  dateSliderValue.value = [0, 100]

  globalTimeRange = []



  readLogFile()
    .then(() => {
      console.log('logLinesHvd:', logLinesHvd.main.length)
      console.log('logLinesTc:', logLinesTc.main.length)
      message.success(`Read ${logLinesHvd.main.length} line HVD logs`)
      message.success(`Read ${logLinesHvd.vc.length} line HVD VC logs`)
      message.success(`Read ${logLinesTc.main.length} line TC logs`)
      message.success(`Read ${logLinesTc.vc.length} line TC VC logs`)

      updateGlobalTimeRange()

      renderGraphs(logLinesHvd.main, log_graphs_hvd_main, logGraphDataList_hvd_main, false)
      renderGraphs(logLinesHvd.vc, log_graphs_hvd_vc, logGraphDataList_hvd_vc, false)
      renderGraphs(logLinesTc.main, log_graphs_tc_main, logGraphDataList_tc_main, false)
      renderGraphs(logLinesTc.vc, log_graphs_tc_vc, logGraphDataList_tc_vc, false)

      analyzeButtonLoading.value = false
      analyzeButtonText.value = 'Analyze'
    })
    .catch((error) => {
      console.error('Error reading log files:', error)
      message.error('Error reading log files')

      analyzeButtonLoading.value = false
      analyzeButtonText.value = 'Analyze'
    })

  // readFilesAsync(logFileHvd.main)
  //   .then((hvdLogs) => {
  //     console.log('hvdLogs:', hvdLogs.length)
  //     mergedHvdLogs = mergeLogFiles(hvdLogs)
  //     console.log('mergedHvdLogs:', mergedHvdLogs.length)
  //     message.success(`Read ${mergedHvdLogs.length} line HVD logs`)

  //     hvdLogsTimeRange = getLogTimeRange(mergedHvdLogs)
  //     message.success(`HVD logs time range: ${hvdLogsTimeRange[0]} - ${hvdLogsTimeRange[1]}`)

  //     log_graphs.forEach((graph) => {
  //       const graphData = graph.process(mergedHvdLogs)
  //       if (graphData.data.length > 1) {
  //         logGraphDataList.value.push(graphData)
  //       }
  //     })

  //     analyzeButtonLoading.value = false
  //     analyzeButtonText.value = 'Analyze'

  //   })
  //   .catch((error) => {
  //     console.error('Error reading HVD logs:', error)
  //     message.error('Error reading HVD logs')

  //     analyzeButtonLoading.value = false
  //     analyzeButtonText.value = 'Analyze'
  //   })

}

</script>

<style></style>
