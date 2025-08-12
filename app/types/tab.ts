export interface Tab {
  id: string;
  name: string;
  route: string;
  content: string;
}

export interface ProjectData {
  name: string;
  port: number;
  tabs: Tab[];
  activeTabId: string | null;
  version: string;
}