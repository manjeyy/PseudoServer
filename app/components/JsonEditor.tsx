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
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <div className="flex items-center gap-4 p-3 border-b border-gray-800 bg-gray-800">
        <div className="flex items-center gap-2">
          <label htmlFor="route" className="text-sm font-medium text-gray-200">
            Route:
          </label>
          <div className="flex items-center">
            <span className="text-sm text-gray-400">/</span>
            <input
              id="route"
              type="text"
              value={route}
              onChange={(e) => onRouteChange(e.target.value)}
              className="px-2 py-1 border border-gray-700 rounded text-sm min-w-32 bg-gray-900 text-gray-100 placeholder-gray-500"
              placeholder="endpoint"
            />
          </div>
        </div>
        
        <button
          onClick={formatJson}
          disabled={!!jsonError || !value.trim()}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Format JSON
        </button>
        
        {jsonError && (
          <span className="text-sm text-red-400">{jsonError}</span>
        )}
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none bg-gray-900 text-gray-100 placeholder-gray-500"
          placeholder="Paste your JSON data here..."
          style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
        />
      </div>
    </div>
  );
}