import type { Resource, Process } from "../App";

interface TopBarProps {
  onAddResource: () => void;
  onDeleteResource: (id: string) => void;
  hasResources: boolean;
  resources: Resource[];
  onAddProcess: () => void;
  onDeleteProcess: (id: string) => void;
  hasProcesses: boolean;
  processes: Process[];
  hasConnections: boolean;
  onUndoConnection: () => void;
}

export default function TopBar({ 
  onAddResource, 
  onDeleteResource, 
  hasResources, 
  resources,
  onAddProcess,
  onDeleteProcess,
  hasProcesses,
  processes,
  hasConnections,
  onUndoConnection
}: TopBarProps) {
  return (
    <div className="w-full bg-white dark:bg-[#1d1f24] shadow px-6 py-3 flex gap-4 border-b border-gray-300 dark:border-gray-700">
      <button 
        onClick={onAddResource}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-colors"
      >
        Add Resource
      </button>

      {hasResources && (
        <button 
          onClick={() => {
            // Delete all resources one by one
            resources.forEach(resource => onDeleteResource(resource.id));
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow transition-colors"
        >
          Delete Resources
        </button>
      )}

      <button 
        onClick={onAddProcess}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition-colors"
      >
        Add Process
      </button>

      {hasProcesses && (
        <button 
          onClick={() => {
            // Delete all processes one by one
            processes.forEach(process => onDeleteProcess(process.id));
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow transition-colors"
        >
          Delete Processes
        </button>
      )}

      {hasConnections && (
        <button 
          onClick={onUndoConnection}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md shadow transition-colors"
        >
          Undo Connection
        </button>
      )}
    </div>
  );
}
