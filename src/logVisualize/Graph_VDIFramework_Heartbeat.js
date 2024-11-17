// 2024-11-13T09:31:20.935Z <Debug> [0x5b40][]HealthCheckManager.cpp:133 onHeartBeatReceived::onHeartBeatReceived: 1
// 2024-11-13T09:41:20.935Z <Debug> [0x5b40][]HealthCheckManager.cpp:133 onHeartBeatReceived::onHeartBeatReceived: 0

import constants from '@/utils/constants'
import { getLogTimeRange } from '@/utils/logUtils';

const Regex_onHeartBeatReceived = /onHeartBeatReceived: (\d)/;

export default class Graph_VDIFramework_Heartbeat {

  process(lines, globalOptions, globalSettings) {

    console.log('Graph_VDIFramework_Heartbeat process');

    const [time_begin, time_end] = getLogTimeRange(lines);

    let data = [];
    data.push(['Time', 'Heartbeat', { role: 'style' }]);

    lines.forEach((line) => {
      let match = line.match(Regex_onHeartBeatReceived);
      if (match) {
        let time_match = line.match(constants.REGEX_TIMESTAMP);
        if (time_match) {
          // point style 1 green, 0 red
          const pointStyle = parseInt(match[1]) ? 'point { size: 5; shape-type: circle; fill-color: #00FF00; }' : 'point { size: 5; shape-type: circle; fill-color: #FF0000; }';
          data.push([new Date(time_match[0]), parseInt(match[1]), pointStyle]);
        }
      }
    });

    let chartOptions = {
      title: 'VDIFramework Heartbeat',
      legend: { position: 'none' },
      chartArea: {
        // leave room for y-axis labels
        width: '100%'
      },
      width: '100%',
      pointSize: 5,
      hAxis: {
        format: 'HH:mm:ss',
        minValue: time_begin,
        maxValue: time_end,
        // viewWindow: {
        //   min: time_begin,
        //   max: time_end
        // }
      },
      explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
        keepInBounds: true,
        axis: 'horizontal',
        maxZoomIn: 0.0025,
        maxZoomOut: 1,
      },
    };

    let chartSettings = {
      packages: ['corechart'],
    };

    return {
      type: 'LineChart',
      data: data,
      options: chartOptions,
      settings: chartSettings,
    };
  }
}
