# Frontend - React + Vite

Modern React typing practice interface with PDF support.

## Quick Start

**Docker**:
```bash
docker build --target dev -t typing-frontend:dev .
docker run -p 5173:5173 typing-frontend:dev
```

**Local**:
```bash
npm install
npm run dev
```

**App**: `http://localhost:5173`

## Project Structure

```
src/
├── pages/            # Full page views (Home, Auth, About, Contact)
├── components/       # Reusable UI components
│   ├── layout/      # Header, Footer, Pdf, Typing layouts
│   └── ui/          # Common widgets
├── context/         # State management (Auth, Pdf, Typing)
├── utils/           # Helpers (IndexedDB, text parsing)
└── assets/          # Static resources
```

## State Management

**React Context API** with three main contexts:

- **AuthContext** - User auth, document management
- **PdfContext** - PDF data, local storage
- **TypingContext** - Typing metrics, session state

## Architecture

```
Pages → Components → Context → Services → API/Database
```

- **Pages**: Route-level components
- **Components**: Reusable UI elements
- **Context**: Global state (auth, pdf, typing)
- **Utilities**: Helpers for storage, text parsing

## Features

- User signup/signin
- PDF upload & management
- Real-time typing metrics (WPM, accuracy, consistency)
- Multi-page document support
- LocalStorage persistence via IndexedDB
- CORS-enabled API communication

## Configuration

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Context API
- IndexedDB
- PDF.js

## Build

**Development**:
```bash
npm run dev
```

**Production**:
```bash
npm run build
npm run preview
```

**Docker Production**:
```bash
docker build -t typing-frontend:prod .
docker run -p 80:80 typing-frontend:prod
```

Served via Nginx on port 80.

### CORS Issues
- Ensure backend is running and accessible
- Check Vite proxy configuration in `vite.config.ts`
- Backend should have CORS middleware enabled

### PDF Rendering Issues
- PDF worker script must be accessible at `/pdf.worker.js`
- Ensure `public/pdf.worker.js` is properly copied
- Check browser console for PDF.js errors

### Authentication Not Persisting
- Verify cookies are enabled in browser settings
- Check that backend sends `access_token` cookie
- Ensure cookies have correct SameSite and HttpOnly flags

### IndexedDB Storage Limits
- IndexedDB has storage quotas (typically 50MB+ per domain)
- Large PDFs may fail to store locally
- Monitor usage in DevTools → Application → IndexedDB

---

## Building for Production

```bash
# Clean build
npm run build

# Preview production build locally
npm run preview

# Build Docker image
docker build --target prod -t typing-frontend:prod .
```

The build generates optimized bundles in the `dist/` directory with:
- Minified JavaScript and CSS
- Tree-shaken dependencies
- Asset hashing for cache busting
- Sourcemaps for debugging (optional)

---

## Environment Variables

Create a `.env` file in the project root if needed:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Typing Practice
```

Access environment variables in code:
```typescript
console.log(import.meta.env.VITE_API_URL);
```

---

## Contributing

When adding new features:
1. Create components in appropriate `components/` subdirectory
2. Update related context if state management needed
3. Run `npm run lint` to check code quality
4. Test in both dev and production builds
5. Update this README if adding major features


---

**Version:** 1.0.0  
**Last Updated:** January 2026
