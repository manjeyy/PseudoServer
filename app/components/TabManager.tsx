'use client';

import { useState } from 'react';
import { Tab } from '../types/tab';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabManagerProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabAdd: () => void;
  onTabDelete: (tabId: string) => void;
  onTabRename: (tabId: string, newName: string) => void;
  onSubRouteAdd: (tabId: string) => void;
}

export default function TabManager({
  tabs,
  activeTabId,
  onTabSelect,
  onTabAdd,
  onTabDelete,
  onTabRename,
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
    <div className="flex items-center h-full">
      <div className="flex items-center h-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "group relative flex items-center h-full px-6 border-r border-border cursor-pointer transition-colors min-w-[160px] max-w-[240px]",
              activeTabId === tab.id
                ? "bg-background text-primary border-t-2 border-t-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border-t-2 border-t-transparent"
            )}
            onClick={() => onTabSelect(tab.id)}
          >
            <div className="flex-1 truncate mr-3">
              {editingTabId === tab.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={finishEditing}
                  onKeyDown={handleKeyPress}
                  className="w-full bg-transparent border-none outline-none text-base font-medium"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className="text-base font-medium truncate block"
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
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded-sm transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button
        onClick={onTabAdd}
        className="h-full px-4 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-r border-border"
        title="Add new tab"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}