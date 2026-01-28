# LaukGPT - Q&A System with HTMX

A modern Q&A system where users can ask questions and administrators can provide answers in real-time using HTMX.

## Project Structure

```
LaukGPT/
├── config/
│   └── config.js                # Application configuration (port, admin credentials, session)
├── database/
│   ├── db.js                    # Database initialization and connection management
│   └── questionService.js       # Question CRUD operations and business logic
├── middleware/
│   └── auth.js                  # Authentication middleware
├── routes/
│   ├── pageRoutes.js            # HTML page routes (/, /login, /admin)
│   ├── authRoutes.js            # Authentication API routes (login, logout)
│   ├── userRoutes.js            # User-facing API routes (submit/view questions)
│   └── adminRoutes.js           # Admin API routes (manage questions/answers)
├── utils/
│   ├── htmlHelpers.js           # HTML escaping and formatting utilities
│   └── htmlTemplates.js         # HTML template generators for HTMX responses
├── public/
│   ├── index.html               # User interface
│   ├── login.html               # Admin login page
│   ├── admin.html               # Admin control panel
│   └── styles.css               # Styles
├── scripts/
│   └── clear-db.js              # Database cleanup utility
├── server.js                    # Main application entry point
├── package.json                 # Node.js dependencies
└── qa_database.db               # SQLite database (auto-generated)
```

## Features

- **User Features:**
  - Submit questions through a simple web interface
  - View all answered questions in real-time
  
- **Admin Features:**
  - Secure admin login
  - View pending questions
  - Answer questions with HTMX-powered real-time updates
  - Manual refresh controls (no auto-refresh interruptions)
  - View all answered questions

## Technology Stack

- **Backend:** Node.js + Express.js
- **Frontend:** HTML + HTMX
- **Database:** SQLite (sql.js)
- **Session Management:** express-session

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. For development with auto-reload:
```bash
npm run dev
```

## Usage

- **User Page:** http://localhost:3000
- **Admin Page:** http://localhost:3000/admin
  - Default credentials: `admin` / `admin123`

## Environment Variables

You can configure the application using environment variables:

- `PORT` - Server port (default: 3000)
- `ADMIN_USERNAME` - Admin username (default: admin)
- `ADMIN_PASSWORD` - Admin password (default: admin123)
- `SESSION_SECRET` - Session secret key
- `DB_PATH` - Database file path (default: qa_database.db)
- `NODE_ENV` - Environment (production/development)

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run clear-db` - Clear all questions from database

## Architecture

The application follows a modular architecture:

### Config Layer (`config/`)
- Centralized configuration management
- Environment variable support

### Database Layer (`database/`)
- Database connection management (`db.js`)
- Data access layer with specific operations (`questionService.js`)

### Middleware Layer (`middleware/`)
- Authentication and authorization
- Request validation

### Routes Layer (`routes/`)
- Separated by concern (pages, auth, user, admin)
- Clean route definitions

### Utils Layer (`utils/`)
- Reusable helper functions
- HTML template generators for consistent responses

### Server (`server.js`)
- Minimal entry point
- Route mounting
- Middleware configuration

## HTMX Features Used

- `hx-post`: Submit forms without page reload
- `hx-get`: Fetch updated content
- `hx-target`: Specify where to insert response
- `hx-swap`: Control how content is swapped
- `hx-trigger`: Manual refresh controls
- `hx-on::before-request`: Disable buttons during submission

## Security Notes

⚠️ **For Production:**
1. Change default admin credentials
2. Use environment variables for sensitive data
3. Enable HTTPS and set `secure: true` for cookies
4. Use proper password hashing (bcrypt)
5. Implement rate limiting
6. Add CSRF protection

## License

ISC
