'use client';

import { useState, useEffect } from 'react';

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
      } catch (error) {
        setJsonError('Invalid JSON format');
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
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <label htmlFor="route" className="text-sm font-medium">
            Route:
          </label>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">/</span>
            <input
              id="route"
              type="text"
              value={route}
              onChange={(e) => onRouteChange(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm min-w-32"
              placeholder="endpoint"
            />
          </div>
        </div>
        
        <button
          onClick={formatJson}
          disabled={!!jsonError || !value.trim()}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Format JSON
        </button>
        
        {jsonError && (
          <span className="text-sm text-red-500">{jsonError}</span>
        )}
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none"
          placeholder="Paste your JSON data here..."
          style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
        />
      </div>
    </div>
  );
}