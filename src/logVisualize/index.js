import Graph_VDIFramework_Heartbeat from './Graph_VDIFramework_Heartbeat';
import Graph_VDIFramework_Roundtrip from './Graph_VDIFramework_Roundtrip';
import Graph_TelephonyStateMachine from './Graph_TelephonyStateMachine';
import Graph_VirtualChannel_State from './Graph_VirtualChannel_State';

const log_graphs = [ new Graph_VDIFramework_Heartbeat(), new Graph_VDIFramework_Roundtrip(), new Graph_TelephonyStateMachine(), new Graph_VirtualChannel_State() ];

export default log_graphs;
