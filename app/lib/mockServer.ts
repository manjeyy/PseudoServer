import express from 'express';
import cors from 'cors';
import { Tab } from '../types/tab';

export class MockServer {
  private app: express.Application;
  private server: any = null;
  private port: number = 3001;
  private tabs: Tab[] = [];

  constructor() {
    this.app = express();
    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupRoutes() {
    this.app._router = express.Router();
    this.setupMiddleware();

    this.tabs.forEach(tab => {
      if (tab.route && tab.content.trim()) {
        try {
          const jsonData = JSON.parse(tab.content);
          const route = tab.route.startsWith('/') ? tab.route : `/${tab.route}`;
          
          this.app.get(route, (req, res) => {
            res.json(jsonData);
          });
        } catch (error) {
          console.error(`Invalid JSON in tab ${tab.name}:`, error);
        }
      }
    });

    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        routes: this.tabs
          .filter(tab => tab.route && tab.content.trim())
          .map(tab => ({
            name: tab.name,
            route: tab.route.startsWith('/') ? tab.route : `/${tab.route}`
          }))
      });
    });
  }

  updateTabs(tabs: Tab[]) {
    this.tabs = tabs;
    if (this.server) {
      this.setupRoutes();
    }
  }

  start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.stop();
      }

      this.port = port;
      this.setupRoutes();

      this.server = this.app.listen(port, () => {
        console.log(`Mock server running on port ${port}`);
        resolve();
      });

      this.server.on('error', (error: any) => {
        reject(error);
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.server = null;
          console.log('Mock server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  isRunning(): boolean {
    return this.server !== null;
  }

  getPort(): number {
    return this.port;
  }
}