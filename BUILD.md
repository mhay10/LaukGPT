# Building the Executable

This document explains how to build the LaukGPT application into a standalone executable.

## Prerequisites

- Node.js installed (for building)
- npm dependencies installed (`npm install`)

## Build Commands

### Build for all platforms
```bash
npm run build
```
This creates executables for Windows, Linux, and macOS in the `dist` folder.

### Build for specific platforms

**Windows only:**
```bash
npm run build:win
```

**Linux only:**
```bash
npm run build:linux
```

**macOS only:**
```bash
npm run build:mac
```

## Output

The executables will be created in the `dist` folder:
- `dist/htmx-qa-system-win.exe` (Windows)
- `dist/htmx-qa-system-linux` (Linux)
- `dist/htmx-qa-system-macos` (macOS)

## Running the Executable

### Windows
Simply double-click `htmx-qa-system-win.exe` or run from command prompt:
```cmd
.\dist\htmx-qa-system-win.exe
```

### Linux/macOS
Make the file executable first:
```bash
chmod +x dist/htmx-qa-system-linux
./dist/htmx-qa-system-linux
```

## Configuration

The application can be configured using environment variables:

- `PORT` - Server port (default: 3000)
- `ADMIN_USERNAME` - Admin username (default: admin)
- `ADMIN_PASSWORD` - Admin password (default: admin123)
- `SESSION_SECRET` - Session secret key
- `DB_PATH` - Database file path (default: qa_database.db)

### Example with environment variables (Windows PowerShell):
```powershell
$env:PORT=8080
$env:ADMIN_USERNAME="myadmin"
$env:ADMIN_PASSWORD="securepass"
.\dist\htmx-qa-system-win.exe
```

### Example with environment variables (Linux/macOS):
```bash
PORT=8080 ADMIN_USERNAME=myadmin ADMIN_PASSWORD=securepass ./dist/htmx-qa-system-linux
```

## Important Notes

1. The executable bundles all dependencies and static files
2. The database file (`qa_database.db`) will be created in the same directory where you run the executable
3. All static files (HTML, CSS) are bundled inside the executable
4. The executable is compressed using GZip to reduce file size
5. First run may be slower as the executable extracts and initializes

## Troubleshooting

### "EACCES: permission denied" on Linux/macOS
Make the file executable:
```bash
chmod +x dist/htmx-qa-system-linux
```

### Database not found
The database file is created in the current working directory. Make sure you have write permissions in the directory where you're running the executable.

### Port already in use
Change the port using the `PORT` environment variable or ensure no other application is using port 3000.
