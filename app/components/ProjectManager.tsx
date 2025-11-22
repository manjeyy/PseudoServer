'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderOpen, Plus, Save } from 'lucide-react';

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
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewProject}
          className="flex-1 justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSaveDialogOpen(true)}
          className="flex-1 justify-start gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 relative"
        asChild
      >
        <label className="cursor-pointer">
          <FolderOpen className="h-4 w-4" />
          Load Project
          <input
            type="file"
            accept=".json"
            onChange={handleFileLoad}
            className="hidden"
          />
        </label>
      </Button>

      {saveDialogOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Save Project</h3>
            <Input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="mb-4"
              placeholder="Project name"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setSaveDialogOpen(false);
                  setProjectName('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!projectName.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}