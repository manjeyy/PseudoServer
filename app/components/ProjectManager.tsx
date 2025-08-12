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
    <div className="flex items-center gap-2 p-2 border-b bg-gray-100">
      <button
        onClick={onNewProject}
        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
      >
        New
      </button>
      
      <button
        onClick={() => setSaveDialogOpen(true)}
        className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
      >
        Save
      </button>
      
      <label className="px-3 py-1 text-sm bg-green-500 text-white hover:bg-green-600 rounded cursor-pointer transition-colors">
        Load
        <input
          type="file"
          accept=".json"
          onChange={handleFileLoad}
          className="hidden"
        />
      </label>

      {saveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Save Project</h3>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              placeholder="Project name"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setSaveDialogOpen(false);
                  setProjectName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!projectName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
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