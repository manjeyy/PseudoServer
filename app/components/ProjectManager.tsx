'use client';

import { useState } from 'react';

interface ProjectManagerProps {
  onSaveProject: (name: string) => void;
  onLoadProject: (file: File) => void;
  onNewProject: () => void;
}

export default function ProjectManager({ onSaveProject, onLoadProject, onNewProject }: ProjectManagerProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleSave = () => {
    if (projectName.trim()) {
      onSaveProject(projectName.trim());
      setSaveDialogOpen(false);
      setProjectName('');
    }
  };

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadProject(file);
    }
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b border-slate-800 bg-slate-900">
      <button
        onClick={onNewProject}
        className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
      >
        New
      </button>
      
      <button
        onClick={() => setSaveDialogOpen(true)}
        className="px-3 py-1 text-sm bg-blue-700 text-white hover:bg-blue-800 rounded transition-colors"
      >
        Save
      </button>
      
      <label className="px-3 py-1 text-sm bg-green-700 text-white hover:bg-green-800 rounded cursor-pointer transition-colors">
        Load
        <input
          type="file"
          accept=".json"
          onChange={handleFileLoad}
          className="hidden"
        />
      </label>

      {saveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-slate-100">Save Project</h3>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded mb-4"
              placeholder="Project name"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setSaveDialogOpen(false);
                  setProjectName('');
                }}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!projectName.trim()}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:bg-slate-700 disabled:text-slate-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}