import { useState } from "react";
import Header from "../components/header";
import ButtonBar from "../components/ButtonBar";
import Graph from "../components/GraphPanel";
import Controls from "../components/ControlPanel";
import AllocationMatrix from "../components/AllocationMatrix";
import RequestMatrix from "../components/RequestMatrix";
import type { Resource, Process, Connection } from "../App";

const CONNECTION_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

const Home = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  const updateResourcePosition = (id: string, x: number, y: number) => {
    setResources(resources.map((resource) =>
      resource.id === id ? { ...resource, x, y } : resource
    ));
  };

  const updateProcessPosition = (id: string, x: number, y: number) => {
    setProcesses(processes.map((process) =>
      process.id === id ? { ...process, x, y } : process
    ));
  };

  const addConnection = (fromId: string, fromType: 'resource' | 'process', toId: string, toType: 'resource' | 'process') => {
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

  return (
    <div className="w-full min-h-screen p-6 flex flex-col gap-4 bg-gray-100">

      {/* HEADER */}
      <Header />

      {/* BUTTON BAR */}
      <ButtonBar />

      {/* MAIN LAYOUT */}
      <div className="flex w-full gap-4 mt-2">

        {/* LEFT GRAPH AREA (flex-grow) */}
        <div className="flex flex-col grow bg-white rounded-xl shadow p-4 min-h-[500px]">
          <Graph 
            resources={resources} 
            onUpdateResourcePosition={updateResourcePosition}
            processes={processes}
            onUpdateProcessPosition={updateProcessPosition}
            connections={connections}
            onAddConnection={addConnection}
            onDeleteConnection={deleteConnection}
          />
        </div>

        {/* FIXED RIGHT PANEL */}
        <div className="flex flex-col gap-4 w-[320px]">

          <Controls />

          <AllocationMatrix />

          <RequestMatrix />

        </div>
      </div>
    </div>
  );
};

export default Home;
