export interface SubRoute {
  id: string;
  name: string;
  route: string;
  content: string;
}

export interface Tab {
  id: string;
  name: string;
  route: string;
  content: string;
  subRoutes?: SubRoute[];
}

export interface ProjectData {
  name: string;
  port: number;
  tabs: Tab[];
  activeTabId: string | null;
  activeSubRouteId: string | null;
  version: string;
}