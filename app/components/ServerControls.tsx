'use client';

import { useState } from 'react';

interface ServerControlsProps {
  onPortChange: (port: number) => void;
  onStartServer: () => void;
  onStopServer: () => void;
  isServerRunning: boolean;
  currentPort: number;
}

export default function ServerControls({
  onPortChange,
  onStartServer,
  onStopServer,
  isServerRunning,
  currentPort
}: ServerControlsProps) {
  const [port, setPort] = useState(currentPort);

  const handlePortChange = (newPort: number) => {
    setPort(newPort);
    onPortChange(newPort);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-700 bg-gray-900">
      <div className="flex items-center gap-2">
        <label htmlFor="port" className="text-sm font-medium text-gray-200">
          Port:
        </label>
        <input
          id="port"
          type="number"
          value={port}
          onChange={(e) => handlePortChange(parseInt(e.target.value) || 3001)}
          className="w-20 px-2 py-1 border border-gray-700 rounded text-sm bg-gray-800 text-gray-100 focus:border-blue-500"
          min="1000"
          max="65535"
          disabled={isServerRunning}
        />
      </div>
      
      <button
        onClick={isServerRunning ? onStopServer : onStartServer}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          isServerRunning
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isServerRunning ? 'Stop Server' : 'Start Server'}
      </button>
      
      {isServerRunning && (
        <span className="text-sm text-green-400 font-medium">
          Server running on http://localhost:{currentPort}
        </span>
      )}
    </div>
  );
}