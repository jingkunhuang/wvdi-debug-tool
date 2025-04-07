// 2024-11-13T09:31:20.935Z <Debug> [0x5b40][]HealthCheckManager.cpp:133 onHeartBeatReceived::onHeartBeatReceived: 1
// 2024-11-13T09:41:20.935Z <Debug> [0x5b40][]HealthCheckManager.cpp:133 onHeartBeatReceived::onHeartBeatReceived: 0

// 2025-01-07T08:14:27.990Z <Debug> [0x6d10][]TelephonyService.cpp:8667 TelephonyService::notifyCallFailure::Call or mid-call feature failed. Locus Id: [00000000-0000-0000-0000-000000000000] Error type = [1000] isFatal = true rawType = [1000] httpStatus = [403]


import { getLogTime, getLogTimeRange } from '@/utils/logUtils';

const Regex_onHeartBeatReceived = /onHeartBeatReceived: (\d)/;
const Regex_CallFailure = /TelephonyService::notifyCallFailure.*Error type = \[(\d+)\]/;

  // onNewMessageReceived: 'session down' received
  const Regex_sessionStatus = /onNewMessageReceived: 'session (up|down)' received/;

export default class Graph_VDIFramework_Heartbeat {

  // eslint-disable-next-line no-unused-vars
  process(lines, globalOptions, globalSettings) {

    console.log('Graph_VDIFramework_Heartbeat process');

    let [time_begin, time_end] = getLogTimeRange(lines);

    if (globalOptions.timeRange && globalOptions.timeRange.length == 2) {
      time_begin = globalOptions.timeRange[0];
      time_end = globalOptions.timeRange[1];
    }

    let data = [];
    data.push(['Time', 'Heartbeat', {role:'annotation'},{ role: 'style' }]);

    lines.forEach((line) => {
      let match = line.match(Regex_onHeartBeatReceived);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          // point style 1 green, 0 red
          const pointStyle = parseInt(match[1]) ? 'point { size: 3; shape-type: circle; fill-color: #00FF00; }' : 'point { size: 5; shape-type: circle; fill-color: #FF0000; }';
          data.push([time, parseInt(match[1]), null, pointStyle]);
        }
      }

      let match_session = line.match(Regex_sessionStatus);
      if (match_session) {
        let time = getLogTime(line);
        if (time) {
          data.push([time, match_session[1] == 'up' ? 1 : 0, 'session ' + match_session[1], null]);
        }
      }
      let match_CallFailure = line.match(Regex_CallFailure);
      if (match_CallFailure) {
        let time = getLogTime(line);
        if (time) {
          data.push([time, 0.5, 'call failed: ' + match_CallFailure[1], null]);
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
      type: 'ScatterChart',
      data: data,
      options: chartOptions,
      settings: chartSettings,
    };
  }
}
