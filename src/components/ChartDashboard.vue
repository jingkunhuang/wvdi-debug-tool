<template>
  <div id="dashboard">
    <div id="chart_div"></div>

    <div id="daterange_div">
      <div id="control_slider"></div>
      <div id="chart_parent_div"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'


const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
})

const data = ref([
  ['Year', 'Sales', 'Expenses'],
  [new Date('2024-11-13T09:10:18.945Z'), 1000, 400],
  [new Date('2024-11-13T09:20:18.945Z'), 1170, 460],
  [new Date('2024-11-13T09:30:18.945Z'), 660, 1120],
  [new Date('2024-11-13T09:40:18.945Z'), 1030, 540],
  [new Date('2024-11-13T09:50:18.945Z'), 1030, 540],
  [new Date('2024-11-13T09:55:18.945Z'), 1030, 540],
  [new Date('2024-11-13T09:59:18.945Z'), 1030, 540],
])

const options = ref({
  title: 'Company Performance',
  curveType: 'function',
  legend: { position: 'bottom' },
  hAxis: {
    viewWindow: {
      min: new Date('2024-11-13T09:20:18.945Z'),
      max: new Date('2024-11-13T09:50:18.945Z')
    }
  },
})

const chart = ref(null)

onMounted(() => {
  google.charts.load('current', { packages: ['corechart', 'timeline', 'controls'] })
  google.charts.setOnLoadCallback(drawChart)
})

function drawChart() {
  if(props.dataList.length == 0) {
    const dataTable = google.visualization.arrayToDataTable(data.value)
    const chartInstance = new google.visualization.LineChart(document.getElementById('chart_div'))
    chartInstance.draw(dataTable, options.value)
    chart.value = chartInstance
    return
  }
  else {
    // clear and create chart div tag under chart_parent_div
    const chartParentDiv = document.getElementById('chart_parent_div')
    chartParentDiv.innerHTML = ''
    props.dataList.forEach((item, index) => {
      const chartDiv = document.createElement('div')
      chartDiv.id = `chart_div_${index}`
      chartParentDiv.appendChild(chartDiv)
    })

    // controls
    var slider = new google.visualization.ControlWrapper({
      'controlType': 'DateRangeFilter',
      'containerId': 'control_slider',
      'options': {
        'filterColumnLabel': 'Time',
        'ui': { 'format': { 'pattern': 'd HH:mm:ss' }, 'step': 'minute' }
      }
    });

    // Create the dashboard.
    var dashboard = new google.visualization.Dashboard(document.getElementById('daterange_div'));

    const chartList = []
    const dataTables = []

    props.dataList.forEach((item, index) => {

      const dataTable = google.visualization.arrayToDataTable(item.data)
      var tz_formatter = new google.visualization.DateFormat({
            pattern: 'd HH:mm:ss',
            timeZone: 0,
        });
        var axis_formatter = new google.visualization.DateFormat({
            pattern: 'HH:mm:ss',
            timeZone: 0,
        });

        tz_formatter.format(dataTable, 0);
        //axis_formatter.format(dataTable, 0);

        dataTables.push(dataTable)

      if (item.type === 'LineChart') {
        //new google.visualization.ChartWrapper
        const chartInstance = new google.visualization.ChartWrapper({
          'chartType': 'LineChart',
          'containerId': `chart_div_${index}`,
          'options': item.options
        })

        //const chartInstance = new google.visualization.LineChart(document.getElementById(`chart_div_${index}`))
        //chartInstance.draw(dataTable, item.options)
        chartList.push(chartInstance)
      }
      else if (item.type === 'Timeline_____') {

        const chartInstance = new google.visualization.Timeline(document.getElementById(`chart_div_${index}`))
        //chartInstance.draw(dataTable, item.options)
        chartList.push(chartInstance)
      }
    })

    // Configure the slider to affect the bar chart, and then draw the dashboard.
    dashboard.bind(slider, chartList);
    dashboard.draw(dataTables[0]);


  }


}

function updateData() {
  data.value = [
    ['Year', 'Sales', 'Expenses'],
    ['2004', 1000, 400],
    ['2005', 1170, 460],
    ['2006', 660, 1120],
    ['2007', 10, 540]
  ]
  drawChart()
}

defineExpose({ updateData })

</script>
