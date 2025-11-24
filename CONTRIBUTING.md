# Contributing to Mocktopus

First off, thanks for taking the time to contribute!

The following is a set of guidelines for contributing to Mocktopus. These are just guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher.
- **npm**: Usually comes with Node.js.
- **Git**: For version control.

### Installation

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/manjeyy/mocktopus.git
   cd mocktopus
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the App

Mocktopus is built with Next.js and Electron. You can run it in two modes:

**1. Web Mode (Next.js only)**
Useful for working on UI components and logic without Electron overhead.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**2. Electron Mode (Desktop App)**
Runs the full desktop application experience.

```bash
npm run electron-dev
```

## Docker & Dev Containers

We support Docker and VS Code Dev Containers to make setting up your environment instant.

### Using VS Code Dev Containers (Recommended)

1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) in VS Code.
2. Open the project in VS Code.
3. Click "Reopen in Container" when prompted, or run the command from the Command Palette.
4. The environment will be set up automatically with Node.js and all dependencies installed.

### Using Docker

You can run the web version of the app using Docker:

```bash
# Build the image
docker compose up --build

# Run the container
docker run -p 3000:3000 mocktopus
```

## Development Workflow

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. Make your changes.
3. Run linting to ensure code quality:
   ```bash
   npm run lint
   ```
4. Commit your changes with a descriptive message.
5. Push to your fork and submit a Pull Request.

## Reporting Bugs

- Use the GitHub Issues tab.
- Describe the issue clearly.
- Include steps to reproduce.
- Attach screenshots if possible.

## Project Structure

- `app/`: Next.js app router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and backend logic.
- `main.js`: Electron main process entry point.
- `preload.js`: Electron preload script.
