import Graph_VDIFramework_Heartbeat from './hvd/Graph_VDIFramework_Heartbeat';
import Graph_VDIFramework_Roundtrip from './hvd/Graph_VDIFramework_Roundtrip';
import Graph_TelephonyStateMachine from './hvd/Graph_TelephonyStateMachine';
import Graph_VDIFramework_StreamState from './common/Graph_VDIFramework_StreamState';
import Graph_VirtualChannel_State from './common/Graph_VirtualChannel_State';

export const log_graphs_hvd_main = [
  new Graph_VDIFramework_Heartbeat(),
  new Graph_VDIFramework_Roundtrip(),
  new Graph_TelephonyStateMachine(),
  new Graph_VDIFramework_StreamState(),
];
export const log_graphs_hvd_vc = [
  new Graph_VirtualChannel_State(),
];
export const log_graphs_tc_main = [
  new Graph_VDIFramework_StreamState(),
];
export const log_graphs_tc_vc = [
  new Graph_VirtualChannel_State(),
];
