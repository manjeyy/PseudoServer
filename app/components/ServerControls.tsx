'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Square, Globe } from 'lucide-react';

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
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-md border border-input">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Port:</span>
        <Input
          type="number"
          value={port}
          onChange={(e) => handlePortChange(parseInt(e.target.value) || 3001)}
          className="w-20 h-7 px-2 py-0 border-none bg-transparent text-sm focus-visible:ring-0 text-foreground"
          min="1000"
          max="65535"
          disabled={isServerRunning}
        />
      </div>
      
      <Button
        onClick={isServerRunning ? onStopServer : onStartServer}
        variant={isServerRunning ? "destructive" : "default"}
        size="sm"
        className="gap-2"
      >
        {isServerRunning ? (
          <>
            <Square className="h-4 w-4 fill-current" />
            Stop
          </>
        ) : (
          <>
            <Play className="h-4 w-4 fill-current" />
            Start
          </>
        )}
      </Button>
    </div>
  );
}