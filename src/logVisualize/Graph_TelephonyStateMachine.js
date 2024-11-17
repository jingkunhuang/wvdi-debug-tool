  // 136891,131: 2024-11-13T09:31:15.568Z <Debug> [0xaf24][]TelephonyStateMachine.cpp:35 telephony::StateMachineLogger::logStateTransitionSuccess::[CallState] Transitioned from CallConnected to DisconnectCall. Call Id = [5aa160cf-b120-446b-b1f4-8dd07f0552e7] Conversation ID = [00000000-0000-0000-0000-000000000000] Locus Id = [2c2d1068-97e7-3f71-8d5f-d1e9e2ef1f61] Type = [MeetingBridge]
  // 139338,131: 2024-11-13T09:31:16.602Z <Debug> [0x9838][]TelephonyStateMachine.cpp:35 telephony::StateMachineLogger::logStateTransitionSuccess::[CallState] Transitioned from DisconnectCall to DisposeCall. Call Id = [5aa160cf-b120-446b-b1f4-8dd07f0552e7] Conversation ID = [00000000-0000-0000-0000-000000000000] Locus Id = [2c2d1068-97e7-3f71-8d5f-d1e9e2ef1f61] Type = [MeetingBridge]

  // 141846,131: 2024-11-13T09:31:47.282Z <Debug> [0xaf24][]TelephonyStateMachine.cpp:35 telephony::StateMachineLogger::logStateTransitionSuccess::[CallState] Transitioned from CallDisconnected to PreviewVideo. Call Id = [9d107073-81c2-4a6a-b5f6-668f4df46075] Conversation ID = [00000000-0000-0000-0000-000000000000] Locus Id = [40c0c65a-3543-33fc-aca2-becda811b873] Type = [MeetingBridge]
  // 143413,131: 2024-11-13T09:31:54.353Z <Debug> [0xaf24][]TelephonyStateMachine.cpp:35 telephony::StateMachineLogger::logStateTransitionSuccess::[CallState] Transitioned from PreviewVideo to ConnectCall. Call Id = [9d107073-81c2-4a6a-b5f6-668f4df46075] Conversation ID = [00000000-0000-0000-0000-000000000000] Locus Id = [40c0c65a-3543-33fc-aca2-becda811b873] Type = [MeetingBridge]
  // 145841,131: 2024-11-13T09:31:54.511Z <Debug> [0xca74][]TelephonyStateMachine.cpp:35 telephony::StateMachineLogger::logStateTransitionSuccess::[CallState] Transitioned from ConnectCall to JoinCall. Call Id = [9d107073-81c2-4a6a-b5f6-668f4df46075] Conversation ID = [00000000-0000-0000-0000-000000000000] Locus Id = [40c0c65a-3543-33fc-aca2-becda811b873] Type = [MeetingBridge]
  // 147072,131: 2024-11-13T09:31:56.301Z <Debug> [0x7128][]TelephonyStateMachine.cpp:35 telephony::StateMachineLogger::logStateTransitionSuccess::[CallState] Transitioned from JoinCall to WaitForMediaConnected. Call Id = [9d107073-81c2-4a6a-b5f6-668f4df46075] Conversation ID = [00000000-0000-0000-0000-000000000000] Locus Id = [40c0c65a-3543-33fc-aca2-becda811b873] Type = [MeetingBridge]
  // 148796,131: 2024-11-13T09:31:56.772Z <Debug> [0xca74][]TelephonyStateMachine.cpp:35 telephony::StateMachineLogger::logStateTransitionSuccess::[CallState] Transitioned from WaitForMediaConnected to CallConnected. Call Id = [9d107073-81c2-4a6a-b5f6-668f4df46075] Conversation ID = [00000000-0000-0000-0000-000000000000] Locus Id = [40c0c65a-3543-33fc-aca2-becda811b873] Type = [MeetingBridge]

  // 2024-11-13T09:31:15.585Z <Debug> [0x538][]TelephonyStateMachine.cpp:15 telephony::StateMachineLogger::logInputHandlerEntry::[MediaState] About to handle [disconnectMedia] request while in MediaConnected. Call Id = [5aa160cf-b120-446b-b1f4-8dd07f0552e7] Conversation ID = [00000000-0000-0000-0000-000000000000] MediaConnectionId = [12626e3a-e846-4d74-b01c-2ef76d7ffeab]
  // 2024-11-13T09:31:15.585Z <Debug> [0x538][]TelephonyStateMachine.cpp:35 telephony::StateMachineLogger::logStateTransitionSuccess::[MediaState] Transitioned from MediaConnected to DisconnectMedia. Call Id = [5aa160cf-b120-446b-b1f4-8dd07f0552e7] Conversation ID = [00000000-0000-0000-0000-000000000000] MediaConnectionId = [12626e3a-e846-4d74-b01c-2ef76d7ffeab]
  // 2024-11-13T09:31:15.585Z <Debug> [0x538][]TelephonyStateMachine.cpp:20 telephony::StateMachineLogger::logStateTransition::State transition [MediaState].MediaConnected --> [MediaState].DisconnectMedia : [disconnectMedia] . Call Id = [5aa160cf-b120-446b-b1f4-8dd07f0552e7] Conversation ID = [00000000-0000-0000-0000-000000000000] MediaConnectionId = [12626e3a-e846-4d74-b01c-2ef76d7ffeab]



import constants from '@/utils/constants'
import { getLogTimeRange } from '@/utils/logUtils';

// [CallState] Transitioned from CallDisconnected to PreviewVideo. Call Id = [9d107073-81c2-4a6a-b5f6-668f4df46075]
const Regex_StateTranstion = /\[(\w+)\] Transitioned from (\w+) to (\w+).*Call Id = \[([0-9a-f-]+)\]/;

// logStateTransition::State transition [MediaState].MediaConnected --> [MediaState].DisconnectMedia : [disconnectMedia] . Call Id = [5aa160cf-b120-446b-b1f4-8dd07f0552e7]
//const Regex_StateTranstion = /State transition \[(\w+)\].(\w+) --> \[(\w+)\].(\w+) : \[(\w+)\].*Call Id = \[([0-9a-f-]+)\]/;

const initial_states = ['CallDisconnected', 'LocusIdle', 'MediaDisconnected'];
const final_states = ['DisposeCall', 'LocusLeft', 'MediaDisconnected'];

export default class Graph_TelephonyStateMachine {

  process(lines, globalOptions, globalSettings) {

    console.log('Graph_TelephonyStateMachine process');

    let callMap = new Map();

    let data = [];

    let [time_begin, time_end] = getLogTimeRange(lines);

    const columns = [
      { type: "string", id: "StateType" },
      { type: "string", id: "StateName" },
      // { type: 'string', role: 'tooltip' },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ];

    data.push(columns);

    lines.forEach((line) => {
      //let match = line.match(Regex_StateTranstion);
      let match = line.match(Regex_StateTranstion);
      if (match) {
        let time_match = line.match(constants.REGEX_TIMESTAMP);
        if (time_match) {

          let transitionTime = new Date(time_match[0]);

          let stateType = match[1];
          let stateFrom = match[2];
          let stateTo = match[3];
          let callId = match[4];
          // let stateType = match[1];
          // let stateFrom = match[2];
          // let stateTo = match[4];
          // let stateAction = match[5];
          // let callId = match[6];

          let currentTransition = { time: transitionTime, from: stateFrom, to: stateTo };

          let call = callMap.get(callId);
          if (!call) {
            call = { callId: callId, stateMap: new Map() };
            callMap.set(callId, call);
          }

          // concate first 8 characters of callId with stateType to make it unique
          //const stateName = 'call_id_' + callId.substring(0, 8) + '_' + stateType;
          const stateName = stateType + '_' + callId.substring(0, 8);
          //const tooltip = stateFrom + ' --> ' + stateTo + ' : ' + stateAction;

          // var tooltip = '<p>' + stateFrom + ' --> ' + stateTo + ' : ' + stateAction + '</p>';
          // tooltip += '<p>Call Id: ' + callId + '</p>';

          let state = call.stateMap.get(stateType);
          if (!state) {
            state = { stateType: stateType, lastTransition: currentTransition, data: [] };
            if(initial_states.includes(stateFrom)) {
              // state initial time is transitionTime minus 1s
              let state_init_time = new Date(transitionTime.getTime() - 1000);
              //state.data.push([stateName, stateFrom, tooltip, state_init_time, transitionTime]);
              state.data.push([stateName, stateFrom, state_init_time, transitionTime]);
            }
            else {
              // state initial time is time_begin
              //state.data.push([stateName, stateFrom, tooltip, time_begin, transitionTime]);
              state.data.push([stateName, stateFrom, time_begin, transitionTime]);
            }
            call.stateMap.set(stateType, state);
          } else {
            let lastTransition = state.lastTransition;

            const end_time_index = 3;
            //const end_time_index = 4;

            if (state.data.length > 0 && state.data[state.data.length - 1][end_time_index] === time_end) {
              state.data[state.data.length - 1][end_time_index] = transitionTime;
            }
            else {
              //state.data.push([stateName, currentTransition.from, tooltip, lastTransition.time, currentTransition.time]);
              state.data.push([stateName, currentTransition.from, lastTransition.time, currentTransition.time]);
            }

            state.lastTransition = currentTransition;

            if(final_states.includes(currentTransition.to)) {
              // state final time is transitionTime plus 1s
              let state_final_time = new Date(transitionTime.getTime() + 1000);
              //state.data.push([stateName, currentTransition.to, tooltip, currentTransition.time, state_final_time]);
              state.data.push([stateName, currentTransition.to, currentTransition.time, state_final_time]);
            }
            else {
              // state final time is time_end
              //state.data.push([stateName, currentTransition.to, tooltip, currentTransition.time, time_end]);
              state.data.push([stateName, currentTransition.to, currentTransition.time, time_end]);
            }
          }

        }
      }

    });  // end of lines.forEach

    callMap.forEach((call) => {
      call.stateMap.forEach((state) => {
        data.push(...state.data);
      });
    }

    );

    var num_rows = 0;
    callMap.forEach((call) => {
      num_rows += call.stateMap.size;
    });

    const chartHeight = num_rows * 40 + 60;

    console.log('time_begin: ' + time_begin);

    let chartOptions = {
      title: 'Telephony State Machine',
      // chartArea: {
      //   // leave room for y-axis labels
      //   width: '100%',
      //   height: "100%",
      // },
      width: '100%',
      height: chartHeight,
      timeline: { groupByRowLabel: true, showRowLabels: false },
      avoidOverlappingGridLines: false,
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
