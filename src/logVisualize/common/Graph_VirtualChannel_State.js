// 2025-01-15 08:28:39,202 DEBUG [0x0000000000003b40] [hannel\src\common\utils\Packets.cpp(328)] [VirtualChannel] [CiscoVirtualChannel::Packetization::PacketizeData] - send message id: 1736951870, numPackets: 1
// 2025-01-15 08:28:39,202 DEBUG [0x0000000000003af4] [hannel\src\common\utils\Packets.cpp(402)] [VirtualChannel] [CiscoVirtualChannel::Packetization::EnqueuePacket] - receive message id: 1736952127

// 2025-03-26 09:09:33,879 INFO  [0x00000000000105cc] [ib\csf-logger\src\LogController.cpp(131)] [LogController] [CSF::csflogger::LogController::Impl::init] - ***** Process launched, start logging *****

// 2025-03-29 04:16:24,814 DEBUG [0x000000016da23000] [mon/vc_agent/VirtualChannelAgent.cpp(72)] [VirtualChannel] [Agent] -  - Virtual Channel Agent created (PRINT_MESSAGES: disabled), version: 1.0.726.0
// 2025-03-29 04:16:38,320 DEBUG [0x000000000000984c] [on\vc_agent\VirtualChannelAgent.cpp(109)] [VirtualChannel] [VirtualChannelAgent::Agent::stop] - hvda - Destroying Virtual Channel Agent

// 2025-03-29 03:18:01,110 WARN  [0x00000001eca18840] [on/vc_agent/VirtualChannelAgent.cpp(751)] [VirtualChannel] [OnVirtualChannelShutdown] -  - Virtual Channel shutting down

// 2025-03-29 03:15:23,022 DEBUG [0x000000000000aac8] [n\vc_agent\VirtualChannelAgent.cpp(1159)] [VirtualChannel] [VirtualChannelAgent::Agent::notifyInfoS] - hvda - INFO-S subscribers notified: 'SessionUp'

// 2025-03-29 03:15:23,939 DEBUG [0x0000000000005b40] [n\vc_agent\VirtualChannelAgent.cpp(1159)] [VirtualChannel] [VirtualChannelAgent::Agent::notifyInfoS] - hvda - INFO-S subscribers notified: 'ChannelUp'

import { getLogTime, getLogTimeRange } from '@/utils/logUtils';

const Regex_VirtualChannel_send = /send message id: (\d+)/;
const Regex_VirtualChannel_receive = /receive message id: (\d+)/;

const Regex_VirtualChannel_process_launched = /Process launched, start logging/;
const Regex_VirtualChannel_session_up = /INFO-S subscribers notified: 'SessionUp'/;
const Regex_VirtualChannel_channel_up = /INFO-S subscribers notified: 'ChannelUp'/;
const Regex_VirtualChannel_session_down = /INFO-S subscribers notified: 'SessionDown'/;
const Regex_VirtualChannel_channel_down = /INFO-S subscribers notified: 'ChannelDown'/;
const Regex_VirtualChannel_shutdown = /Virtual Channel shutting down/;
const Regex_VirtualChannel_created = /Virtual Channel Agent created/;
const Regex_VirtualChannel_destroy = /Destroying Virtual Channel Agent/;



export default class Graph_VirtualChannel_State {

  // eslint-disable-next-line no-unused-vars
  process(lines, globalOptions, globalSettings) {

    console.log('Graph_VirtualChannel_sendrecv process');

    let [time_begin, time_end] = getLogTimeRange(lines);

    if (globalOptions.timeRange && globalOptions.timeRange.length == 2) {
      time_begin = globalOptions.timeRange[0];
      time_end = globalOptions.timeRange[1];
    }

    let data = [];
    //data.push(['Time', 'sendrecv', {role:'annotation'},{ role: 'style' }]);
    data.push(['Time', 'data', { role: 'style' }, { role: 'tooltip' }, {role:'annotation'}]);

    lines.forEach((line) => {
      let match = line.match(Regex_VirtualChannel_send);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
          data.push([time, 1, 'point { size: 3; shape-type: circle; fill-color:rgb(0, 255, 21); }', `Send ID: ${match[1]}\nTime: ${timeStr}`, null]);
        }
      }

      match = line.match(Regex_VirtualChannel_receive);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
          data.push([time, 0, 'point { size: 3; shape-type: circle; fill-color:rgb(144, 85, 13); }', `Receive ID: ${match[1]}\nTime: ${timeStr}`, null]);
        }
      }

      // process launched
      match = line.match(Regex_VirtualChannel_process_launched);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
          data.push([time, 0.5, null, `Process launched\nTime: ${timeStr}`, 'launched']);
        }
      }

      // Regex_VirtualChannel_created
      // match = line.match(Regex_VirtualChannel_created);
      // if (match) {
      //   let time = getLogTime(line);
      //   if (time) {
      //     const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
      //     data.push([time, 0.75, null, `Virtual Channel Agent created\nTime: ${timeStr}`, 'vc created']);
      //   }
      // }

      // Regex_VirtualChannel_destroy
      // match = line.match(Regex_VirtualChannel_destroy);
      // if (match) {
      //   let time = getLogTime(line);
      //   if (time) {
      //     const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
      //     data.push([time, 0.25, null, `Virtual Channel Agent destroyed\nTime: ${timeStr}`, 'vc destroy']);
      //   }
      // }

      // Regex_VirtualChannel_session_up
      match = line.match(Regex_VirtualChannel_session_up);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
          data.push([time, 0.75, null, `Session Up\nTime: ${timeStr}`, 's-up']);
        }
      }

      // Regex_VirtualChannel_channel_up
      match = line.match(Regex_VirtualChannel_channel_up);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
          data.push([time, 0.65, null, `Channel Up\nTime: ${timeStr}`, 'c-up']);
        }
      }

      // Regex_VirtualChannel_session_down
      match = line.match(Regex_VirtualChannel_session_down);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
          data.push([time, 0.25, null, `Session Down\nTime: ${timeStr}`, 's-down']);
        }
      }
      // Regex_VirtualChannel_channel_down
      match = line.match(Regex_VirtualChannel_channel_down);
      if (match) {
        let time = getLogTime(line);
        if (time) {
          const timeStr = new Date(time).toLocaleTimeString('en-US', { hour12: false });
          data.push([time, 0.45, null, `Channel Down\nTime: ${timeStr}`, 'c-down']);
        }
      }


    });

    let chartOptions = {
      title: 'Virtual Channel',
      legend: { position: 'none' },
      chartArea: {
        // leave room for y-axis labels
        width: '100%'
      },
      width: '100%',
      pointSize: 3,
      hAxis: {
        format: 'HH:mm:ss',
        minValue: time_begin,
        maxValue: time_end,
      },
      explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
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
