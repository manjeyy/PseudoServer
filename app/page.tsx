'use client';

import { useState, useEffect, useCallback } from 'react';
import ServerControls from './components/ServerControls';
import TabManager from './components/TabManager';
import JsonEditor from './components/JsonEditor';
import ProjectManager from './components/ProjectManager';
import { useTabManager } from './hooks/useTabManager';
import { ProjectData } from './types/tab';

let mockServerPort = 3001;
let mockServerRunning = false;
const mockRoutes = new Map<string, any>();

export default function Home() {
  const {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    deleteTab,
    renameTab,
    updateTabContent,
    updateTabRoute,
    setAllTabs
  } = useTabManager();

  const [serverPort, setServerPort] = useState(3001);
  const [isServerRunning, setIsServerRunning] = useState(false);

  useEffect(() => {
    if (isServerRunning) {
      const routes: [string, any][] = [];
      tabs.forEach(tab => {
        if (tab.route && tab.content.trim()) {
          try {
            const jsonData = JSON.parse(tab.content);
            const route = tab.route.startsWith('/') ? tab.route : `/${tab.route}`;
            routes.push([route, jsonData]);
            mockRoutes.set(route, jsonData);
          } catch (error) {
            console.error(`Invalid JSON in tab ${tab.name}:`, error);
          }
        }
      });
      
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        console.log('Updating routes:', routes);
        (window as any).electronAPI.updateRoutes(routes);
      }
    }
  }, [tabs, isServerRunning]);

  const handleStartServer = useCallback(async () => {
    try {
      const routes: [string, any][] = [];
      tabs.forEach(tab => {
        if (tab.route && tab.content.trim()) {
          try {
            const jsonData = JSON.parse(tab.content);
            const route = tab.route.startsWith('/') ? tab.route : `/${tab.route}`;
            routes.push([route, jsonData]);
          } catch (error) {
            console.error(`Invalid JSON in tab ${tab.name}:`, error);
          }
        }
      });

      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        console.log('Starting server with routes:', routes);
        await (window as any).electronAPI.startServer(serverPort, routes);
      } else {
        mockServerPort = serverPort;
        mockServerRunning = true;
        routes.forEach(([route, data]) => {
          mockRoutes.set(route, data);
        });
      }
      setIsServerRunning(true);
    } catch (error) {
      console.error('Failed to start server:', error);
      alert(`Failed to start server: ${error.message}`);
    }
  }, [serverPort, tabs]);

  const handleStopServer = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        await (window as any).electronAPI.stopServer();
      } else {
        mockServerRunning = false;
      }
      setIsServerRunning(false);
      mockRoutes.clear();
    } catch (error) {
      console.error('Failed to stop server:', error);
    }
  }, []);

  const handleSaveProject = useCallback((name: string) => {
    const projectData: ProjectData = {
      name,
      port: serverPort,
      tabs,
      activeTabId,
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [tabs, activeTabId, serverPort]);

  const handleLoadProject = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData: ProjectData = JSON.parse(e.target?.result as string);
        setAllTabs(projectData.tabs);
        setServerPort(projectData.port);
        if (isServerRunning) {
          handleStopServer();
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        alert('Invalid project file');
      }
    };
    reader.readAsText(file);
  }, [setAllTabs, isServerRunning, handleStopServer]);

  const handleNewProject = useCallback(() => {
    if (isServerRunning) {
      handleStopServer();
    }
    setAllTabs([{
      id: Date.now().toString(),
      name: 'New Tab',
      route: 'api/data',
      content: '{\n  "message": "Hello World",\n  "data": []\n}'
    }]);
    setServerPort(3001);
  }, [isServerRunning, handleStopServer, setAllTabs]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <ProjectManager
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
        onNewProject={handleNewProject}
      />
      
      <ServerControls
        onPortChange={setServerPort}
        onStartServer={handleStartServer}
        onStopServer={handleStopServer}
        isServerRunning={isServerRunning}
        currentPort={serverPort}
      />
      
      <TabManager
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onTabAdd={addTab}
        onTabDelete={deleteTab}
        onTabRename={renameTab}
      />
      
      <div className="flex-1">
        {activeTab && (
          <JsonEditor
            value={activeTab.content}
            onChange={(content) => updateTabContent(activeTab.id, content)}
            route={activeTab.route}
            onRouteChange={(route) => updateTabRoute(activeTab.id, route)}
          />
        )}
      </div>
    </div>
  );
}