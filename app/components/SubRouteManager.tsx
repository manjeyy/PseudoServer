'use client';

import { useState } from 'react';
import { SubRoute } from '../types/tab';

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

    if (subRoutes.length === 0) {
        return (
            <div className="w-48 border-r border-gray-800 bg-gray-900 p-2">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Sub Routes</span>
                    <button
                        onClick={onSubRouteAdd}
                        className="px-2 py-1 text-xs bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
                        title="Add sub route"
                    >
                        +
                    </button>
                </div>
                <div className="text-xs text-gray-500 text-center py-4">
                    No sub routes yet
                </div>
            </div>
        );
    }

    return (
        <div className="w-48 border-r border-gray-800 bg-gray-900 flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-300">Sub Routes</span>
                <button
                    onClick={onSubRouteAdd}
                    className="px-2 py-1 text-xs bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
                    title="Add sub route"
                >
                    +
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {subRoutes.map((subRoute) => (
                    <div
                        key={subRoute.id}
                        className={`group relative border-b border-gray-800 ${
                            activeSubRouteId === subRoute.id
                                ? 'bg-blue-900 border-l-4 border-l-blue-700'
                                : 'hover:bg-gray-800'
                        }`}
                    >
                        <div
                            className="flex items-center justify-between p-2 cursor-pointer"
                            onClick={() => onSubRouteSelect(subRoute.id)}
                        >
                            <div className="flex-1 min-w-0">
                                {editingSubRouteId === subRoute.id ? (
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onBlur={finishEditing}
                                        onKeyDown={handleKeyPress}
                                        className="w-full text-xs bg-transparent border-none outline-none text-gray-100"
                                        autoFocus
                                    />
                                ) : (
                                    <div
                                        className="text-xs font-medium truncate text-gray-100"
                                        onDoubleClick={() => startEditing(subRoute)}
                                        title={subRoute.name}
                                    >
                                        {subRoute.name}
                                    </div>
                                )}
                                <div className="text-xs text-gray-400 truncate" title={`${baseRoute}/${subRoute.route}`}>
                                    /{subRoute.route}
                                </div>
                            </div>
                            
                            {subRoutes.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSubRouteDelete(subRoute.id);
                                    }}
                                    className="ml-2 px-1 py-1 opacity-0 group-hover:opacity-100 hover:bg-red-700 hover:text-white rounded transition-all text-xs text-gray-400"
                                    title="Delete sub route"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
