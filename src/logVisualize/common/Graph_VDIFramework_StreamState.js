// 2024-11-11T15:08:09.362Z <Debug> [0x4b4c][]HvdVirtualChannelHelper.cpp:168 onNewInfoMessageReceived::onNewMessageReceived: 'session down' received
// 2024-11-04T19:14:58.320Z <Debug> [0x2e88][]HvdVirtualChannelHelper.cpp:163 onNewInfoMessageReceived::onNewMessageReceived: 'session up' received

// 2024-11-04T19:14:58.766Z <Debug> [0x2e88][]HvdVirtualChannelHelper.cpp:145 onNewInfoMessageReceived::onNewMessageReceived: 'channel up' received
// 2024-11-11T15:08:09.393Z <Debug> [0x4b4c][]HvdVirtualChannelHelper.cpp:150 onNewInfoMessageReceived::onNewMessageReceived: 'channel down' received

// 2024-11-11T14:02:18.430Z <Debug> [0x4b4c][]HvdStream.cpp:150 updateStreamStatus::stream name:Basic PreState:0
// 2024-11-11T14:02:18.430Z <Debug> [0x4b4c][]HvdStream.cpp:183 updateStreamStatus::stream name:Basic AfterState:0

  import { getLogTime, getLogTimeRange } from '@/utils/logUtils';

  // updateStreamStatus::stream name:Basic AfterState:0
  const Regex_updateStreamStatus = /stream name:(\w+) (Pre|After)State:(\d+)/;

  // onNewMessageReceived: 'session down' received
  const Regex_sessionStatus = /onNewMessageReceived: 'session (up|down)' received/;

  // onNewMessageReceived: 'channel up' received
  const Regex_channelStatus = /onNewMessageReceived: 'channel (up|down)' received/;

  function getStateName(state) {
    switch (state) {
      case '0':
        return 'Unavailable';
      case '1':
        return 'StreamAvailable';
      case '2':
        return 'PeerUnsupported';
      case '3':
        return 'AvaliableWithoutEncryption';
      default:
        return 'Unknown';
    }
  }

  export default class Graph_VDIFramework_StreamState {

    // eslint-disable-next-line no-unused-vars
    process(lines, globalOptions, globalSettings) {

      console.log('Graph_VirtualChannel_State process');

      // stream state
      let streamMap = new Map();

      let data = [];

      let [time_begin, time_end] = getLogTimeRange(lines);

      if (globalOptions.timeRange && globalOptions.timeRange.length == 2) {
        time_begin = globalOptions.timeRange[0];
        time_end = globalOptions.timeRange[1];
      }

      const columns = [
        { type: "string", id: "StreamName" },
        { type: "string", id: "StateName" },
        // { type: 'string', role: 'tooltip' },
        { type: "date", id: "Start" },
        { type: "date", id: "End" },
      ];

      data.push(columns);

      lines.forEach((line) => {
        let match = line.match(Regex_updateStreamStatus);
        if (match) {
          let time = getLogTime(line);
          if (time) {
            let updateTime = time;

            let streamName = match[1];
            let stateType = match[2] + 'State';
            let stateValue = getStateName(match[3]);

            let stream = streamMap.get(streamName);
            if (!stream) {
              stream = { streamName: streamName, states: [{time: updateTime, state: stateValue}], data: [] };
              streamMap.set(streamName, stream);
            }
            else {
              if(stream.states[stream.states.length - 1].state !== stateValue) {
                stream.states.push({time: updateTime, state: stateValue});
              }
              else {
                if (stream.states.length == 1) {
                  stream.states[0].time = updateTime;
                }
              }
            }
          }
        }
      }); // end lines.forEach

      streamMap.forEach((stream) => {
        for(let i = 0; i < stream.states.length; i++) {
          if (i == 0)
          {
            data.push([stream.streamName, stream.states[i].state, time_begin, stream.states[i].time]);
          }
          else if (i == stream.states.length - 1)
          {
            data.push([stream.streamName, stream.states[i].state, stream.states[i].time, time_end]);
          }
          else
          {
            data.push([stream.streamName, stream.states[i].state, stream.states[i].time, stream.states[i + 1].time]);
          }
        }
      });

      // session up/down
      let sessionData = []

      // channel up/down

      var num_rows = streamMap.size;

      const chartHeight = num_rows * 40 + 60;

      console.log('num_rows: ' + num_rows);
      console.log('time_begin: ' + time_begin);

      let chartOptions = {
        title: 'Virtual Channel State',
        // chartArea: {
        //   // leave room for y-axis labels
        //   width: '100%',
        //   height: "100%",
        // },
        width: '100%',
        height: chartHeight,
        timeline: { groupByRowLabel: true, showRowLabels: false },
        avoidOverlappingGridLines: true,
        // legend: { position: 'bottom' },
        explorer: {
          actions: ['dragToZoom', 'rightClickToReset'],
          keepInBounds: true,
          maxZoomIn: 0.0025,
          maxZoomOut: 1,
        },
        hAxis: {
          format: 'HH:mm:ss',
          minValue: time_begin,
          maxValue: time_end,
          // viewWindow: {
          //   min: time_begin,
          //   max: time_end
          // }
        },
      };

      // Set colors for each state
      const stateColors = {
        'Unavailable': '#FF0000', // Red
        'StreamAvailable': '#00FF00', // Green
        'PeerUnsupported': '#0000FF', // Blue
        'AvaliableWithoutEncryption': '#FFFF00', // Yellow
        'Unknown': '#808080' // Gray
      };

      const colors = data.slice(1).map(row => stateColors[row[1]] || '#000000'); // Default to black if no color is found

      chartOptions.colors = colors;

      let chartSettings = {
        packages: ['timeline'],
      };

      return {
        type: 'Timeline',
        data: data,
        options: chartOptions,
        settings: chartSettings,
      };
    }
  }
