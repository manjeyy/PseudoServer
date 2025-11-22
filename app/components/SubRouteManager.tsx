'use client';

import { useState } from 'react';
import { SubRoute } from '../types/tab';
import { Plus, Trash2, FileJson, MoreVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubRouteManagerProps {
    subRoutes: SubRoute[];
    activeSubRouteId: string | null;
    baseRoute: string;
    onSubRouteSelect: (subRouteId: string) => void;
    onSubRouteAdd: () => void;
    onSubRouteDelete: (subRouteId: string) => void;
    onSubRouteRename: (subRouteId: string, newName: string) => void;
}

export default function SubRouteManager({
    subRoutes,
    activeSubRouteId,
    baseRoute,
    onSubRouteSelect,
    onSubRouteAdd,
    onSubRouteDelete,
    onSubRouteRename
}: SubRouteManagerProps) {
    const [editingSubRouteId, setEditingSubRouteId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const startEditing = (subRoute: SubRoute) => {
        setEditingSubRouteId(subRoute.id);
        setEditingName(subRoute.name);
    };

    const finishEditing = () => {
        if (editingSubRouteId && editingName.trim()) {
            onSubRouteRename(editingSubRouteId, editingName.trim());
        }
        setEditingSubRouteId(null);
        setEditingName('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            finishEditing();
        } else if (e.key === 'Escape') {
            setEditingSubRouteId(null);
            setEditingName('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Sub Routes</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onSubRouteAdd}
                    title="Add sub route"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {subRoutes.map((subRoute) => (
                    <div
                        key={subRoute.id}
                        className={cn(
                            "group flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors text-base",
                            activeSubRouteId === subRoute.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => onSubRouteSelect(subRoute.id)}
                    >
                        <FileJson className="h-5 w-5 shrink-0 opacity-70" />
                        
                        <div className="flex-1 min-w-0">
                            {editingSubRouteId === subRoute.id ? (
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={finishEditing}
                                    onKeyDown={handleKeyPress}
                                    className="w-full bg-transparent border border-primary/50 rounded px-1 text-sm outline-none"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <div className="flex flex-col">
                                    <span 
                                        className="font-medium truncate"
                                        onDoubleClick={() => startEditing(subRoute)}
                                    >
                                        {subRoute.name}
                                    </span>
                                    <span className="text-xs opacity-60 truncate">
                                        /{subRoute.route}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {subRoutes.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSubRouteDelete(subRoute.id);
                                }}
                                className="opacity-100 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
