import { useState } from "react";
import Header from "./components/header";
import TopBar from "./components/TopBar";
import GraphPanel from "./components/GraphPanel";
import ControlPanel from "./components/ControlPanel";
import InfoBox from "./components/InfoBox";
import MatrixBox from "./components/MatrixBox";
import ThemeToggle from "./components/ThemeToggle";

export interface Resource {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface Process {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  fromId: string;
  fromType: 'resource' | 'process';
  toId: string;
  toType: 'resource' | 'process';
  color: string;
}

const CONNECTION_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

export interface DeadlockResult {
  hasDeadlock: boolean;
  cycles: string[][];
  mutualExclusions: string[];
  resourceRequests: [string, string[]][];
  holdAndWait: string[];
  suggestions: string[];
}

export default function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [deadlockResult, setDeadlockResult] = useState<DeadlockResult | null>(null);

  const addResource = () => {
    const newResource: Resource = {
      id: `R${resources.length + 1}`,
      name: `R${resources.length + 1}`,
      x: Math.random() * 70 + 10, // Random position between 10% and 80%
      y: Math.random() * 70 + 10,
    };
    setResources([...resources, newResource]);
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const updateResourcePosition = (id: string, x: number, y: number) => {
    setResources(resources.map((resource) =>
      resource.id === id ? { ...resource, x, y } : resource
    ));
  };

  const addProcess = () => {
    const newProcess: Process = {
      id: `P${processes.length + 1}`,
      name: `P${processes.length + 1}`,
      x: Math.random() * 70 + 10, // Random position between 10% and 80%
      y: Math.random() * 70 + 10,
    };
    setProcesses([...processes, newProcess]);
  };

  const deleteProcess = (id: string) => {
    setProcesses(processes.filter((process) => process.id !== id));
  };

  const updateProcessPosition = (id: string, x: number, y: number) => {
    setProcesses(processes.map((process) =>
      process.id === id ? { ...process, x, y } : process
    ));
  };

  const addConnection = (fromId: string, fromType: 'resource' | 'process', toId: string, toType: 'resource' | 'process') => {
    // Check if connection already exists
    const exists = connections.some(
      conn => (conn.fromId === fromId && conn.toId === toId) || (conn.fromId === toId && conn.toId === fromId)
    );
    
    if (exists || fromId === toId) return;

    const colorIndex = connections.length % CONNECTION_COLORS.length;
    const newConnection: Connection = {
      id: `conn-${connections.length + 1}`,
      fromId,
      fromType,
      toId,
      toType,
      color: CONNECTION_COLORS[colorIndex],
    };
    setConnections([...connections, newConnection]);
  };

  const deleteConnection = (id: string) => {
    setConnections(connections.filter((conn) => conn.id !== id));
  };

  const detectDeadlock = () => {
    // Build adjacency list for the graph
    const graph: Map<string, string[]> = new Map();
    const allNodes = new Set<string>();
    
    // Add all nodes
    resources.forEach(r => allNodes.add(r.id));
    processes.forEach(p => allNodes.add(p.id));
    
    // Initialize graph
    allNodes.forEach(node => graph.set(node, []));
    
    // Add edges from connections
    connections.forEach(conn => {
      const from = conn.fromId;
      const to = conn.toId;
      if (!graph.has(from)) graph.set(from, []);
      graph.get(from)?.push(to);
    });
    
    // Check for deadlock pattern: Process → Resource → Process (where second process has no outgoing edges)
    const deadlockChains: string[][] = [];
    
    // Find all Process → Resource → Process chains
    connections.forEach(conn1 => {
      // Check if this is Process → Resource
      if (conn1.fromType === 'process' && conn1.toType === 'resource') {
        const process1 = conn1.fromId;
        const resource = conn1.toId;
        
        // Find Resource → Process connections
        connections.forEach(conn2 => {
          if (conn2.fromId === resource && conn2.toType === 'process') {
            const process2 = conn2.toId;
            
            // Check if process2 has no outgoing connections (not waiting for anything)
            const process2Outgoing = connections.filter(c => c.fromId === process2);
            
            // If process2 is not linked to any other resource, this is a deadlock
            if (process2Outgoing.length === 0) {
              deadlockChains.push([process1, resource, process2]);
            }
          }
        });
      }
    });
    
    // Also check for cycles (traditional deadlock detection)
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[][] = [];
    
    const dfs = (node: string, path: string[]): boolean => {
      visited.add(node);
      recStack.add(node);
      path.push(node);
      
      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, [...path])) {
            return true;
          }
        } else if (recStack.has(neighbor)) {
          // Found a cycle
          const cycleStart = path.indexOf(neighbor);
          if (cycleStart !== -1) {
            const cycle = path.slice(cycleStart);
            cycle.push(neighbor); // Complete the cycle
            cycles.push(cycle);
          }
          return true;
        }
      }
      
      recStack.delete(node);
      return false;
    };
    
    // Check all nodes for cycles
    allNodes.forEach(node => {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    });
    
    // Check for mutual exclusion (resources with multiple requests)
    const resourceRequests: Map<string, string[]> = new Map();
    connections.forEach(conn => {
      if (conn.toType === 'resource') {
        const resourceId = conn.toId;
        if (!resourceRequests.has(resourceId)) {
          resourceRequests.set(resourceId, []);
        }
        resourceRequests.get(resourceId)?.push(conn.fromId);
      }
    });
    
    const mutualExclusions: string[] = [];
    resourceRequests.forEach((requesters, resourceId) => {
      if (requesters.length > 1) {
        mutualExclusions.push(resourceId);
      }
    });
    
    // Check for Hold and Wait condition
    // A process holds at least one resource and waits for additional resources
    const processHolds: Map<string, string[]> = new Map(); // Process -> Resources it holds
    const processWaits: Map<string, string[]> = new Map(); // Process -> Resources it waits for
    
    connections.forEach(conn => {
      if (conn.fromType === 'resource' && conn.toType === 'process') {
        // Resource → Process: Process holds this resource
        const processId = conn.toId;
        const resourceId = conn.fromId;
        if (!processHolds.has(processId)) {
          processHolds.set(processId, []);
        }
        processHolds.get(processId)?.push(resourceId);
      } else if (conn.fromType === 'process' && conn.toType === 'resource') {
        // Process → Resource: Process waits for this resource
        const processId = conn.fromId;
        const resourceId = conn.toId;
        if (!processWaits.has(processId)) {
          processWaits.set(processId, []);
        }
        processWaits.get(processId)?.push(resourceId);
      }
    });
    
    // Find processes that both hold and wait (Hold and Wait condition)
    const holdAndWait: string[] = [];
    processHolds.forEach((_, processId) => {
      if (processWaits.has(processId) && processWaits.get(processId)!.length > 0) {
        holdAndWait.push(processId);
      }
    });
    
    // Deadlock exists if we have cycles OR deadlock chains OR hold and wait condition
    const hasDeadlock = cycles.length > 0 || deadlockChains.length > 0 || holdAndWait.length > 0;
    
    // Generate suggestions to resolve deadlock
    const suggestions: string[] = [];
    if (hasDeadlock) {
      if (cycles.length > 0) {
        suggestions.push(`Break the cycle by releasing a resource in the cycle: ${cycles[0].join(' → ')}`);
        suggestions.push(`Terminate one of the processes in the cycle to release its resources`);
      }
      if (deadlockChains.length > 0) {
        const chain = deadlockChains[0];
        suggestions.push(`Process ${chain[2]} should release resource ${chain[1]} to allow ${chain[0]} to proceed`);
        suggestions.push(`Consider preempting resource ${chain[1]} from process ${chain[2]} and allocate it to ${chain[0]}`);
      }
      if (holdAndWait.length > 0) {
        holdAndWait.forEach(processId => {
          const held = processHolds.get(processId) || [];
          const waiting = processWaits.get(processId) || [];
          suggestions.push(`Process ${processId} holds [${held.join(', ')}] and waits for [${waiting.join(', ')}] - Release held resources first`);
        });
        suggestions.push(`Implement "all or nothing" resource allocation to prevent hold and wait`);
        suggestions.push(`Require processes to request all resources at once before execution`);
      }
      suggestions.push(`Implement timeout mechanisms to prevent indefinite waiting`);
      suggestions.push(`Use resource ordering to prevent circular wait conditions`);
      suggestions.push(`Implement deadlock avoidance algorithms (like Banker's Algorithm)`);
    } else {
      suggestions.push(`No deadlock detected. System is safe.`);
      if (mutualExclusions.length > 0) {
        suggestions.push(`Monitor resources with mutual exclusion: ${mutualExclusions.join(', ')}`);
      }
    }
    
    return {
      hasDeadlock,
      cycles: cycles.length > 0 ? cycles : deadlockChains,
      mutualExclusions,
      resourceRequests: Array.from(resourceRequests.entries()),
      holdAndWait,
      suggestions
    };
  };

  return (
    <div className="w-full min-h-screen bg-[#eef0f4] dark:bg-[#0e0f11] flex flex-col relative">

      <ThemeToggle />

      <Header />
      <TopBar 
        onAddResource={addResource} 
        onDeleteResource={deleteResource}
        hasResources={resources.length > 0}
        resources={resources}
        onAddProcess={addProcess}
        onDeleteProcess={deleteProcess}
        hasProcesses={processes.length > 0}
        processes={processes}
        hasConnections={connections.length > 0}
        onUndoConnection={() => {
          if (connections.length > 0) {
            const lastConnection = connections[connections.length - 1];
            deleteConnection(lastConnection.id);
          }
        }}
      />

      {/* Middle layout */}
      <div className="flex flex-1 w-full px-4 py-4 gap-4 min-h-[600px]">

        {/* LEFT: Graph */}
        <div className="flex-1 min-h-[500px]">
          <GraphPanel 
            resources={resources} 
            onUpdateResourcePosition={updateResourcePosition}
            processes={processes}
            onUpdateProcessPosition={updateProcessPosition}
            connections={connections}
            onAddConnection={addConnection}
            onDeleteConnection={deleteConnection}
          />
        </div>

        {/* RIGHT: Controls & boxes */}
        <div className="w-[300px] flex flex-col gap-4">
          <ControlPanel 
            onDetectDeadlock={() => {
              const result = detectDeadlock();
              setDeadlockResult(result);
            }}
            onReset={() => {
              setDeadlockResult(null);
            }}
          />
          <InfoBox 
            title="Deadlock Detection" 
            deadlockResult={deadlockResult}
          />
          <InfoBox 
            title="Summary" 
            deadlockResult={deadlockResult}
            showSuggestions={true}
          />
        </div>
      </div>

      {/* Bottom boxes */}
      <div className="w-full px-4 pb-4 flex gap-4">
        <MatrixBox title="Allocation Matrix" />
        <MatrixBox title="Request Matrix" />
      </div>
    </div>
  );
}
