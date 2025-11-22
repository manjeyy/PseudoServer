const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const cors = require('cors');
const path = require('path');

let mainWindow;
let mockServer = null;
let mockApp = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // In production, load from the built static files
        const indexPath = path.join(__dirname, 'out', 'index.html');
        mainWindow.loadFile(indexPath);
    }
};

const createMockServer = () => {
    mockApp = express();
    mockApp.use(cors());
    mockApp.use(express.json());
    return mockApp;
};

const setupRoutes = (routes) => {
    if (!mockApp) {
        createMockServer();
    }
    if (!mockServer) {
        mockApp = express();
        mockApp.use(cors());
        mockApp.use(express.json());
    } else {
        mockApp = express();
        mockApp.use(cors());
        mockApp.use(express.json());
    }
    
    routes.forEach(([route, data]) => {
        console.log(`Setting up route: ${route}`);
        mockApp.get(route, (req, res) => {
            console.log(`Request to ${route}`);
            res.json(data);
        });
    });
    
    mockApp.get('/health', (req, res) => {
        res.json({ 
            status: 'ok', 
            routes: routes.map(([route]) => route),
            timestamp: new Date().toISOString()
        });
    });
};

if (!ipcMain.listenerCount('start-server')) {
    ipcMain.handle('start-server', async (event, port, routes) => {
        try {
            console.log(`Starting server on port ${port} with routes:`, routes);
            
            if (mockServer) {
                console.log('Stopping existing server...');
                await new Promise((resolve) => {
                    mockServer.close(resolve);
                });
                mockServer = null;
            }
            
            setupRoutes(routes);
            
            return new Promise((resolve, reject) => {
                mockServer = mockApp.listen(port, '0.0.0.0', () => {
                    console.log(`Mock server started on http://localhost:${port}`);
                    resolve();
                });
                
                mockServer.on('error', (error) => {
                    console.error('Server error:', error);
                    reject(error);
                });
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            throw error;
        }
    });
}

if (!ipcMain.listenerCount('stop-server')) {
    ipcMain.handle('stop-server', async () => {
        console.log('Stopping server...');
        if (mockServer) {
            return new Promise((resolve) => {
                mockServer.close(() => {
                    mockServer = null;
                    console.log('Mock server stopped');
                    resolve();
                });
            });
        }
    });
}

if (!ipcMain.listenerCount('update-routes')) {
    ipcMain.handle('update-routes', async (event, routes) => {
        console.log('Updating routes:', routes);
        if (mockServer) {
            const port = mockServer.address().port;
            console.log(`Restarting server on port ${port} with updated routes`);
            
            await new Promise((resolve) => {
                mockServer.close(() => {
                    mockServer = null;
                    resolve();
                });
            });
            
            setupRoutes(routes);
            
            return new Promise((resolve, reject) => {
                mockServer = mockApp.listen(port, '0.0.0.0', () => {
                    console.log(`Mock server restarted on http://localhost:${port}`);
                    resolve();
                });
                
                mockServer.on('error', (error) => {
                    console.error('Server restart error:', error);
                    reject(error);
                });
            });
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (mockServer) {
        mockServer.close();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});