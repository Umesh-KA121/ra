import { useRef, useState } from "react";
import type { Resource, Process, Connection } from "../App";

interface GraphPanelProps {
  resources: Resource[];
  onUpdateResourcePosition: (id: string, x: number, y: number) => void;
  processes: Process[];
  onUpdateProcessPosition: (id: string, x: number, y: number) => void;
  connections: Connection[];
  onAddConnection: (fromId: string, fromType: 'resource' | 'process', toId: string, toType: 'resource' | 'process') => void;
  onDeleteConnection?: (id: string) => void;
}

export default function GraphPanel({ 
  resources, 
  onUpdateResourcePosition,
  processes,
  onUpdateProcessPosition,
  connections,
  onAddConnection
}: GraphPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingType, setDraggingType] = useState<'resource' | 'process' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'resource' | 'process' | null>(null);
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const handleResourceMouseDown = (e: React.MouseEvent<HTMLDivElement>, resource: Resource) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerX = e.clientX - rect.left;
    const containerY = e.clientY - rect.top;
    
    setMouseDownPos({ x: e.clientX, y: e.clientY });
    setHasMoved(false);
    
    const resourceX = (resource.x / 100) * rect.width;
    const resourceY = (resource.y / 100) * rect.height;
    
    setDragOffset({
      x: containerX - resourceX,
      y: containerY - resourceY,
    });
    setDraggingId(resource.id);
    setDraggingType('resource');
  };

  const handleResourceClick = (e: React.MouseEvent<HTMLDivElement>, resource: Resource) => {
    // Only handle click if mouse hasn't moved much (not a drag)
    if (hasMoved) return;
    
    e.stopPropagation();
    
    if (selectedId && selectedType) {
      if (selectedId === resource.id && selectedType === 'resource') {
        // Deselect if clicking the same item
        setSelectedId(null);
        setSelectedType(null);
      } else {
        // Create connection
        onAddConnection(selectedId, selectedType, resource.id, 'resource');
        setSelectedId(null);
        setSelectedType(null);
      }
    } else {
      // Select this resource
      setSelectedId(resource.id);
      setSelectedType('resource');
    }
  };

  const handleProcessMouseDown = (e: React.MouseEvent<HTMLDivElement>, process: Process) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerX = e.clientX - rect.left;
    const containerY = e.clientY - rect.top;
    
    setMouseDownPos({ x: e.clientX, y: e.clientY });
    setHasMoved(false);
    
    const processX = (process.x / 100) * rect.width;
    const processY = (process.y / 100) * rect.height;
    
    setDragOffset({
      x: containerX - processX,
      y: containerY - processY,
    });
    setDraggingId(process.id);
    setDraggingType('process');
  };

  const handleProcessClick = (e: React.MouseEvent<HTMLDivElement>, process: Process) => {
    // Only handle click if mouse hasn't moved much (not a drag)
    if (hasMoved) return;
    
    e.stopPropagation();
    
    if (selectedId && selectedType) {
      if (selectedId === process.id && selectedType === 'process') {
        // Deselect if clicking the same item
        setSelectedId(null);
        setSelectedType(null);
      } else {
        // Create connection
        onAddConnection(selectedId, selectedType, process.id, 'process');
        setSelectedId(null);
        setSelectedType(null);
      }
    } else {
      // Select this process
      setSelectedId(process.id);
      setSelectedType('process');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if mouse has moved significantly (drag vs click)
    const moveThreshold = 5;
    const deltaX = Math.abs(e.clientX - mouseDownPos.x);
    const deltaY = Math.abs(e.clientY - mouseDownPos.y);
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      setHasMoved(true);
    }

    if (!draggingId || !draggingType || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerX = e.clientX - rect.left;
    const containerY = e.clientY - rect.top;
    
    const newX = ((containerX - dragOffset.x) / rect.width) * 100;
    const newY = ((containerY - dragOffset.y) / rect.height) * 100;
    
    // Constrain to container bounds (0% to 100%)
    const constrainedX = Math.max(0, Math.min(100, newX));
    const constrainedY = Math.max(0, Math.min(100, newY));
    
    if (draggingType === 'resource') {
      onUpdateResourcePosition(draggingId, constrainedX, constrainedY);
    } else if (draggingType === 'process') {
      onUpdateProcessPosition(draggingId, constrainedX, constrainedY);
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setDraggingType(null);
    setHasMoved(false);
  };

  const getItemPosition = (id: string, type: 'resource' | 'process') => {
    if (type === 'resource') {
      const item = resources.find(r => r.id === id);
      return item ? { x: item.x, y: item.y } : null;
    } else {
      const item = processes.find(p => p.id === id);
      return item ? { x: item.x, y: item.y } : null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1d1f24] h-full rounded-xl shadow-xl p-4 min-h-[500px]">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Graph Visualization
      </h2>

      <div
        ref={containerRef}
        className="w-full h-[90%] bg-[#f7f8fa] dark:bg-[#2a2d33] rounded-lg border border-gray-300 dark:border-gray-700 relative overflow-hidden min-h-[450px]"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          // Deselect when clicking on empty area
          if (e.target === e.currentTarget) {
            setSelectedId(null);
            setSelectedType(null);
          }
        }}
      >
        {/* SVG for drawing connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Define arrow marker */}
          <defs>
            {connections.map((connection) => (
              <marker
                key={`marker-${connection.id}`}
                id={`arrowhead-${connection.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 10 3, 0 6"
                  fill={connection.color}
                />
              </marker>
            ))}
          </defs>
          {connections.map((connection) => {
            const fromPos = getItemPosition(connection.fromId, connection.fromType);
            const toPos = getItemPosition(connection.toId, connection.toType);
            
            if (!fromPos || !toPos) return null;
            
            if (!containerRef.current) return null;
            const rect = containerRef.current.getBoundingClientRect();
            
            // Calculate positions
            const fromX = (fromPos.x / 100) * rect.width;
            const fromY = (fromPos.y / 100) * rect.height;
            const toX = (toPos.x / 100) * rect.width;
            const toY = (toPos.y / 100) * rect.height;
            
            // Calculate angle for arrow direction
            const angle = Math.atan2(toY - fromY, toX - fromX);
            
            // Offset from center to edge of circle/box (radius = 25px for both)
            const offset = 25;
            const x1 = fromX + Math.cos(angle) * offset;
            const y1 = fromY + Math.sin(angle) * offset;
            const x2 = toX - Math.cos(angle) * offset;
            const y2 = toY - Math.sin(angle) * offset;
            
            return (
              <line
                key={connection.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={connection.color}
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd={`url(#arrowhead-${connection.id})`}
              />
            );
          })}
        </svg>

        {/* Graph Canvas Area */}
        {resources.length === 0 && processes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 z-10">
            <p className="text-sm">Click "Add Resource" or "Add Process" to add items to the graph</p>
          </div>
        )}
        {resources.map((resource) => (
          <div
            key={resource.id}
            className={`absolute bg-blue-500 dark:bg-blue-600 text-white rounded-lg shadow-lg p-2 min-w-[50px] flex items-center justify-center cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all z-20 ${
              draggingId === resource.id && draggingType === 'resource' ? 'scale-105' : ''
            } ${
              selectedId === resource.id && selectedType === 'resource' ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
            }`}
            style={{
              left: `${resource.x}%`,
              top: `${resource.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={(e) => handleResourceMouseDown(e, resource)}
            onClick={(e) => handleResourceClick(e, resource)}
          >
            <span className="font-semibold text-xs">{resource.name}</span>
          </div>
        ))}
        {processes.map((process) => (
          <div
            key={process.id}
            className={`absolute bg-green-500 dark:bg-green-600 text-white rounded-full shadow-lg w-[50px] h-[50px] flex items-center justify-center cursor-pointer hover:bg-green-600 dark:hover:bg-green-700 transition-all z-20 ${
              draggingId === process.id && draggingType === 'process' ? 'scale-105' : ''
            } ${
              selectedId === process.id && selectedType === 'process' ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
            }`}
            style={{
              left: `${process.x}%`,
              top: `${process.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={(e) => handleProcessMouseDown(e, process)}
            onClick={(e) => handleProcessClick(e, process)}
          >
            <span className="font-semibold text-xs">{process.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
