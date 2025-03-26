// 2024-11-13T09:10:23.708Z <Debug> [0x616c][]HealthMonitor.cpp:122 PingAndWaitInSecond::enter PingAndWaitInSecond

// 2024-11-13T09:10:23.745Z <Debug> [0x616c][]HealthMonitor.cpp:133 PingAndWaitInSecond::leave PingAndWaitInSecond

import { getLogTime, getLogTimeRange } from '@/utils/logUtils';

const Regex_PingAndWaitInSecond = /(enter|leave) PingAndWaitInSecond/;

export default class Graph_VDIFramework_Roundtrip {

  // eslint-disable-next-line no-unused-vars
  process(lines, globalOptions, globalSettings) {

    console.log('Graph_VDIFramework_Roundtrip process');

    const [time_begin, time_end] = getLogTimeRange(lines);

    let data = [];
    data.push(['Time', 'Roundtrip', { role: 'style' }]);

    let start_time = undefined;

    lines.forEach((line) => {
      let match = line.match(Regex_PingAndWaitInSecond);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          if (match[1] == 'enter') {
            start_time = time;
          } else if (match[1] == 'leave' && start_time) {
            let roundtrip = time - start_time;
            // point style < 1000ms green, < 10s orange, >= 10s red
            //const pointStyle = roundtrip < 1000*10 ? 'point { size: 2; shape-type: circle; fill-color: #00FF00; }' : 'point { size: 5; shape-type: circle; fill-color: #FF0000; }';
            const pointStyle = roundtrip < 1000 ? 'point { size: 2; shape-type: circle; fill-color: #00FF00; }' : roundtrip < 10000 ? 'point { size: 5; shape-type: circle; fill-color: #FFA500; }' : 'point { size: 5; shape-type: circle; fill-color: #FF0000; }';
            data.push([time, roundtrip, pointStyle]);
          }
        }
      }
    });

    let chartOptions = {
      title: 'VDIFramework Media Channel Roundtrip',
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
      type: 'ScatterChart',
      data: data,
      options: chartOptions,
      settings: chartSettings,
    };
  }
}
