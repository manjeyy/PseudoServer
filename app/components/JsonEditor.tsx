'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Braces, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  route: string;
  onRouteChange: (route: string) => void;
}

export default function JsonEditor({ value, onChange, route, onRouteChange }: JsonEditorProps) {
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (value.trim()) {
      try {
        JSON.parse(value);
        setJsonError(null);
      } catch (e) {
        setJsonError('Invalid JSON format');
        console.log(e)
      }
    } else {
      setJsonError(null);
    }
  }, [value]);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (error) {
      setJsonError('Cannot format invalid JSON');
      console.log(error)
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-base font-medium text-muted-foreground whitespace-nowrap">
            GET
          </span>
          <div className="flex items-center flex-1 max-w-md relative">
            <span className="absolute left-3 text-muted-foreground text-base">/</span>
            <Input
              type="text"
              value={route}
              onChange={(e) => onRouteChange(e.target.value)}
              className="pl-6 font-mono text-base h-10"
              placeholder="endpoint"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {jsonError && (
            <div className="flex items-center gap-1 text-destructive text-sm mr-2">
              <AlertCircle className="h-4 w-4" />
              <span>{jsonError}</span>
            </div>
          )}
          
          <Button
            onClick={formatJson}
            disabled={!!jsonError || !value.trim()}
            variant="secondary"
            size="default"
            className="gap-2"
          >
            <Braces className="h-4 w-4" />
            Format JSON
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-full p-6 font-mono text-base border-none outline-none resize-none bg-background text-foreground placeholder:text-muted-foreground/50 focus:ring-0 leading-relaxed",
            jsonError && "bg-destructive/5"
          )}
          placeholder="Paste your JSON data here..."
          spellCheck={false}
          style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
        />
      </div>
    </div>
  );
}