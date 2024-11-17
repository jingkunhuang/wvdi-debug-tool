<template>
  <a-card hoverable style="margin-bottom: 16px">
    <GChart type="LineChart" :data="chartData" :options="chartOptions" :settings="chartSettings" />
  </a-card>
</template>

<script>
import { GChart } from 'vue-google-charts'

export default {
  name: 'LineChartCard',
  components: {
    GChart,
  },
  data() {
    return {
      chartData: [
        ['Year', 'Sales', 'Expenses'],
        [2013, 1000, 400],
        [2014, 1170, 460],
        [2015, 660, 1120],
        [2016, 1030, 540],
      ],
      chartOptions: {
        title: 'Company Performance',
        legend: { position: 'bottom' },
        explorer: {
          axis: 'horizontal',
          keepInBounds: true,
        },
      },
      chartSettings: {
        packages: ['corechart'],
        language: 'en',
      },
    }
  },
}
</script>

<style scoped>
/* Add any styles you need for your component */
</style>
