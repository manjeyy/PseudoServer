'use client';

import { useState } from 'react';
import { Tab } from '../types/tab';

interface TabManagerProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabAdd: () => void;
  onTabDelete: (tabId: string) => void;
  onTabRename: (tabId: string, newName: string) => void;
}

export default function TabManager({
  tabs,
  activeTabId,
  onTabSelect,
  onTabAdd,
  onTabDelete,
  onTabRename
}: TabManagerProps) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEditing = (tab: Tab) => {
    setEditingTabId(tab.id);
    setEditingName(tab.name);
  };

  const finishEditing = () => {
    if (editingTabId && editingName.trim()) {
      onTabRename(editingTabId, editingName.trim());
    }
    setEditingTabId(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
      setEditingName('');
    }
  };

  return (
    <div className="flex items-center border-b border-slate-800 bg-slate-900">
      <div className="flex items-center overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center group relative min-w-0 ${
              activeTabId === tab.id
                ? 'bg-slate-800 border-t-2 border-t-blue-500'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <div
              className="flex items-center px-3 py-2 cursor-pointer"
              onClick={() => onTabSelect(tab.id)}
            >
              {editingTabId === tab.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={finishEditing}
                  onKeyDown={handleKeyPress}
                  className="text-sm border-none outline-none min-w-0 w-24 bg-slate-700 text-white"
                  autoFocus
                />
              ) : (
                <span
                  className="text-sm truncate max-w-32 text-slate-200"
                  onDoubleClick={() => startEditing(tab)}
                  title={tab.name}
                >
                  {tab.name}
                </span>
              )}
            </div>
            
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabDelete(tab.id);
                }}
                className="px-2 py-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all text-slate-400"
                title="Close tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button
        onClick={onTabAdd}
        className="px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        title="Add new tab"
      >
        +
      </button>
    </div>
  );
}