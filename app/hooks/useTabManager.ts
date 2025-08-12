import { useState, useCallback } from 'react';
import { Tab } from '../types/tab';

export function useTabManager(initialTabs: Tab[] = []) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs.length > 0 ? initialTabs : [
    {
      id: '1',
      name: 'New Tab',
      route: 'api/data',
      content: '{\n  "message": "Hello World",\n  "data": []\n}'
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string | null>(
    initialTabs.length > 0 ? initialTabs[0].id : '1'
  );

  const addTab = useCallback(() => {
    const newTab: Tab = {
      id: Date.now().toString(),
      name: 'New Tab',
      route: 'api/new',
      content: '{\n  "message": "New endpoint"\n}'
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
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
          content: '{\n  "message": "Hello World"\n}'
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
  }, []);

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return {
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
  };
}