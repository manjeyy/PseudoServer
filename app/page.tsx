'use client';

import { useState, useEffect, useCallback } from 'react';
import ServerControls from './components/ServerControls';
import TabManager from './components/TabManager';
import SubRouteManager from './components/SubRouteManager';
import JsonEditor from './components/JsonEditor';
import ProjectManager from './components/ProjectManager';
import { useTabManager } from './hooks/useTabManager';
import { ProjectData } from './types/tab';

let mockServerPort = 3001;
let mockServerRunning = false;
const mockRoutes = new Map<string, Record<string, unknown>>();

export default function Home() {
  const {
    tabs,
    activeTab,
    activeTabId,
    activeSubRoute,
    activeSubRouteId,
    setActiveTabId,
    setActiveSubRouteId,
    addTab,
    deleteTab,
    renameTab,
    updateTabContent,
    updateTabRoute,
    setAllTabs,
    addSubRoute,
    deleteSubRoute,
    renameSubRoute,
    updateSubRouteContent,
    updateSubRouteRoute
  } = useTabManager();

  const [serverPort, setServerPort] = useState(3001);
  const [isServerRunning, setIsServerRunning] = useState(false);

  useEffect(() => {
    if (isServerRunning) {
      const routes: [string, any][] = [];
      tabs.forEach(tab => {
        // Add main tab route
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
        
        // Add sub-routes
        if (tab.subRoutes) {
          tab.subRoutes.forEach(subRoute => {
            if (subRoute.route && subRoute.content.trim()) {
              try {
                const jsonData = JSON.parse(subRoute.content);
                const baseRoute = tab.route.startsWith('/') ? tab.route : `/${tab.route}`;
                const fullRoute = `${baseRoute}/${subRoute.route}`;
                routes.push([fullRoute, jsonData]);
                mockRoutes.set(fullRoute, jsonData);
              } catch (error) {
                console.error(`Invalid JSON in sub-route ${subRoute.name}:`, error);
              }
            }
          });
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
        // Add main tab route
        if (tab.route && tab.content.trim()) {
          try {
            const jsonData = JSON.parse(tab.content);
            const route = tab.route.startsWith('/') ? tab.route : `/${tab.route}`;
            routes.push([route, jsonData]);
          } catch (error) {
            console.error(`Invalid JSON in tab ${tab.name}:`, error);
          }
        }
        
        // Add sub-routes
        if (tab.subRoutes) {
          tab.subRoutes.forEach(subRoute => {
            if (subRoute.route && subRoute.content.trim()) {
              try {
                const jsonData = JSON.parse(subRoute.content);
                const baseRoute = tab.route.startsWith('/') ? tab.route : `/${tab.route}`;
                const fullRoute = `${baseRoute}/${subRoute.route}`;
                routes.push([fullRoute, jsonData]);
              } catch (error) {
                console.error(`Invalid JSON in sub-route ${subRoute.name}:`, error);
              }
            }
          });
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
    } catch (error: any) {
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
      activeSubRouteId,
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
  }, [tabs, activeTabId, activeSubRouteId, serverPort]);

  const handleLoadProject = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData: ProjectData = JSON.parse(e.target?.result as string);
        setAllTabs(projectData.tabs);
        setServerPort(projectData.port);
        if (projectData.activeSubRouteId) {
          setActiveSubRouteId(projectData.activeSubRouteId);
        }
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
      content: '{\n  "message": "Hello World",\n  "data": []\n}',
      subRoutes: []
    }]);
    setServerPort(3001);
    setActiveSubRouteId(null);
  }, [isServerRunning, handleStopServer, setAllTabs]);

  return (
    <div className="h-screen flex flex-col bg-slate-900">
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
        onTabSelect={(tabId) => {
          setActiveTabId(tabId);
          setActiveSubRouteId(null);
        }}
        onTabAdd={addTab}
        onTabDelete={deleteTab}
        onTabRename={renameTab}
        onSubRouteAdd={(tabId) => addSubRoute(tabId)}
      />
      
      <div className="flex flex-1">
        {activeTab && activeTab.subRoutes && activeTab.subRoutes.length > 0 && (
          <SubRouteManager
            subRoutes={activeTab.subRoutes}
            activeSubRouteId={activeSubRouteId}
            baseRoute={activeTab.route}
            onSubRouteSelect={setActiveSubRouteId}
            onSubRouteAdd={() => addSubRoute(activeTab.id)}
            onSubRouteDelete={(subRouteId) => deleteSubRoute(activeTab.id, subRouteId)}
            onSubRouteRename={(subRouteId, newName) => renameSubRoute(activeTab.id, subRouteId, newName)}
          />
        )}
        
        <div className="flex-1">
          {activeTab && (
            <JsonEditor
              value={activeSubRoute ? activeSubRoute.content : activeTab.content}
              onChange={(content) => 
                activeSubRoute 
                  ? updateSubRouteContent(activeTab.id, activeSubRoute.id, content)
                  : updateTabContent(activeTab.id, content)
              }
              route={activeSubRoute ? `${activeTab.route}/${activeSubRoute.route}` : activeTab.route}
              onRouteChange={(route) => 
                activeSubRoute
                  ? updateSubRouteRoute(activeTab.id, activeSubRoute.id, route.replace(`${activeTab.route}/`, ''))
                  : updateTabRoute(activeTab.id, route)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}