import { useState, useCallback } from 'react';
import { Tab, SubRoute } from '../types/tab';

export function useTabManager(initialTabs: Tab[] = []) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs.length > 0 ? initialTabs : [
    {
      id: '1',
      name: 'New Tab',
      route: 'api/data',
      content: '{\n  "message": "Hello World",\n  "data": []\n}',
      subRoutes: []
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string | null>(
    initialTabs.length > 0 ? initialTabs[0].id : '1'
  );
  const [activeSubRouteId, setActiveSubRouteId] = useState<string | null>(null);

  const addTab = useCallback(() => {
    const newTab: Tab = {
      id: Date.now().toString(),
      name: 'New Tab',
      route: 'api/new',
      content: '{\n  "message": "New endpoint"\n}',
      subRoutes: []
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setActiveSubRouteId(null);
  }, []);

  const deleteTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const filtered = prev.filter(tab => tab.id !== tabId);
      if (filtered.length === 0) {
        // Always keep at least one tab
        const defaultTab: Tab = {
          id: Date.now().toString(),
          name: 'New Tab',
          route: 'api/data',
          content: '{\n  "message": "Hello World"\n}',
          subRoutes: []
        };
        setActiveTabId(defaultTab.id);
        return [defaultTab];
      }
      
      if (activeTabId === tabId) {
        setActiveTabId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeTabId]);

  const renameTab = useCallback((tabId: string, newName: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, name: newName } : tab
    ));
  }, []);

  const updateTabContent = useCallback((tabId: string, content: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, content } : tab
    ));
  }, []);

  const updateTabRoute = useCallback((tabId: string, route: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, route } : tab
    ));
  }, []);

  const setAllTabs = useCallback((newTabs: Tab[]) => {
    setTabs(newTabs);
    if (newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }
    setActiveSubRouteId(null);
  }, []);

  // Sub-route management functions
  const addSubRoute = useCallback((tabId: string) => {
    const newSubRoute: SubRoute = {
      id: Date.now().toString(),
      name: 'New Sub Route',
      route: '1',
      content: '{\n  "message": "Sub route data"\n}'
    };
    
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, subRoutes: [...(tab.subRoutes || []), newSubRoute] }
        : tab
    ));
    setActiveSubRouteId(newSubRoute.id);
  }, []);

  const deleteSubRoute = useCallback((tabId: string, subRouteId: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, subRoutes: (tab.subRoutes || []).filter(sr => sr.id !== subRouteId) }
        : tab
    ));
    
    if (activeSubRouteId === subRouteId) {
      setActiveSubRouteId(null);
    }
  }, [activeSubRouteId]);

  const renameSubRoute = useCallback((tabId: string, subRouteId: string, newName: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { 
            ...tab, 
            subRoutes: (tab.subRoutes || []).map(sr => 
              sr.id === subRouteId ? { ...sr, name: newName } : sr
            ) 
          }
        : tab
    ));
  }, []);

  const updateSubRouteContent = useCallback((tabId: string, subRouteId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { 
            ...tab, 
            subRoutes: (tab.subRoutes || []).map(sr => 
              sr.id === subRouteId ? { ...sr, content } : sr
            ) 
          }
        : tab
    ));
  }, []);

  const updateSubRouteRoute = useCallback((tabId: string, subRouteId: string, route: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { 
            ...tab, 
            subRoutes: (tab.subRoutes || []).map(sr => 
              sr.id === subRouteId ? { ...sr, route } : sr
            ) 
          }
        : tab
    ));
  }, []);

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
  const activeSubRoute = activeTab?.subRoutes?.find(sr => sr.id === activeSubRouteId) || null;

  return {
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
  };
}