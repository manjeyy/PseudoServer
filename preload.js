const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    startServer: (port, routes) => ipcRenderer.invoke('start-server', port, routes),
    stopServer: () => ipcRenderer.invoke('stop-server'),
    updateRoutes: (routes) => ipcRenderer.invoke('update-routes', routes)
});