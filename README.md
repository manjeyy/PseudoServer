# PseudoServer - Mock API Server with Electron and Next.js

PseudoServer is a desktop application built with Electron and Next.js that allows you to create and manage mock API servers. It provides a user-friendly interface to define API routes, paste JSON data, and serve it as a mock API. This is perfect for testing and prototyping applications without needing a backend.

## Features

- **Mock API Server**: Start and stop a mock server with customizable routes and JSON responses.
- **Tab Management**: Add, delete, and rename tabs to manage multiple API endpoints.
- **JSON Editor**: Paste and format JSON data with validation.
- **Route Configuration**: Define custom routes for each API endpoint.
- **Project Management**: Save and load projects to persist your work.
- **Electron Integration**: Runs as a desktop application with a Next.js UI.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manjeyy/PseudoServer.git
   cd PseudoServer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application in development mode:
   ```bash
   npm run electron-dev
   ```

4. Build the application for production:
   ```bash
   npm run electron-build
   ```

## Usage

### Starting the Server

1. Open the application.
2. Set the desired port number in the top-left corner.
3. Click the "Start Server" button to start the mock server.
4. The server will be accessible at `http://localhost:<port>`.

### Managing Tabs

- **Add a Tab**: Click the `+` button to add a new tab.
- **Rename a Tab**: Double-click on a tab name to rename it.
- **Delete a Tab**: Click the `×` button on a tab to delete it.

### Configuring Routes

1. Select a tab.
2. Enter a route name (e.g., `api/users`) in the route input field.
3. Paste your JSON data into the editor.
4. The data will be served at `http://localhost:<port>/<route>`.

### Saving and Loading Projects

- **Save Project**: Click the "Save" button, enter a project name, and save it as a `.json` file.
- **Load Project**: Click the "Load" button and select a previously saved `.json` file.

### Health Check

Access the `/health` endpoint to view all active routes:
```bash
http://localhost:<port>/health
```

## Development

### Folder Structure

- `app/`: Contains the Next.js application.
  - `components/`: Reusable React components.
  - `hooks/`: Custom React hooks.
  - `lib/`: Utility libraries (e.g., mock server logic).
  - `types/`: TypeScript type definitions.
- `main.js`: Electron main process file.
- `preload.js`: Preload script for Electron.

### Scripts

- `npm run dev`: Start the Next.js development server.
- `npm run electron-dev`: Start the Electron app in development mode.
- `npm run build`: Build the Next.js app for production.
- `npm run electron-build`: Build the Electron app for production.

## Troubleshooting

- **Port in Use**: If the desired port is already in use, change the port number in the application.
- **Invalid JSON**: Ensure the JSON data in the editor is valid. Use the "Format JSON" button to fix formatting issues.
- **Server Not Starting**: Check the terminal for errors and ensure no other process is using the same port.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Enjoy using PseudoServer for your mock API needs!
