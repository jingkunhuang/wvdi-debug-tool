import Graph_VDIFramework_Heartbeat from './Graph_VDIFramework_Heartbeat';
import Graph_VDIFramework_Roundtrip from './Graph_VDIFramework_Roundtrip';
import Graph_TelephonyStateMachine from './Graph_TelephonyStateMachine';

const log_graphs = [ new Graph_VDIFramework_Heartbeat(), new Graph_VDIFramework_Roundtrip(), new Graph_TelephonyStateMachine() ];

export default log_graphs;
