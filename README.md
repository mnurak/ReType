# Typing - Read · Type · Learn

Merge reading and typing practice into one productive habit. Upload PDFs, type real passages, and track your progress in real-time.

## Quick Start

**Clone & Setup**:
```bash
git clone https://github.com/mnurak/ReType.git
cd Typing
```

**Docker Dev**:
```bash
make dev-build-up
```

**Docker Prod**:
```bash
make prod-build-up
```

**Manual**:
```bash
# Backend
cd typing-backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd typing-ui
npm install
npm run dev
```

**Access**:
- App: `http://localhost:5173`
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

## Features

### 📚 Document Management
- Upload PDF documents
- Store documents in cloud
- Multi-page support
- Delete documents anytime

### ⌨️ Typing Practice
- Real-time metrics (WPM, accuracy)
- Multi-page typing sessions
- Error tracking
- Performance consistency measurement
- Live progress feedback

### 👤 User Features
- Signup/login with JWT auth
- Secure password storage (Bcrypt)
- Session persistence
- HTTP-only cookies

### 💾 Data Management
- Cloud document storage
- Local PDF caching (IndexedDB)
- Offline access to cached PDFs
- Automatic backend sync

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Auth**: JWT + Bcrypt
- **PDF**: PyMuPDF (text extraction)
- **Server**: Gunicorn (prod), Uvicorn (dev)

### Frontend
- **Framework**: React 19
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State**: Context API
- **Storage**: IndexedDB
- **Server**: Nginx (prod)

## Architecture

```
Frontend (React)          Backend (FastAPI)
├── Pages                 ├── Routers
├── Components           ├── Services
├── Context (State)      ├── Database (SQLAlchemy)
└── Utils               └── Dependencies (Auth)
        ↓                        ↓
    Nginx (prod)         PostgreSQL
    Vite (dev)          Gunicorn/Uvicorn
```

## Project Structure

```
Typing/
├── typing-backend/      # FastAPI service
│   ├── app/
│   │   ├── routers/     # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── database/    # Models & connections
│   │   └── dependencies/# JWT middleware
│   ├── requirements.txt
│   └── dockerfile
│
├── typing-ui/           # React application
│   ├── src/
│   │   ├── pages/       # Route components
│   │   ├── components/  # Reusable UI
│   │   ├── context/     # State management
│   │   └── utils/       # Helpers
│   ├── package.json
│   └── dockerfile
│
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Makefile             # Build shortcuts
└── README.md
```

## API Endpoints

### Auth (`/api/auth`)
- `POST /signup` - Register
- `POST /signin` - Login
- `DELETE /signout` - Logout

### Documents (`/api/doc`)
- `POST /add` - Upload PDF
- `GET /getList` - List documents
- `GET /get/{filename}` - Download
- `DELETE /delete/{filename}` - Delete

### PDF (`/api/pdf`)
- `POST /extract` - Extract text

### Health
- `GET /health` - Status

## Database

**Users**: id, email, hashed_password  
**Documents**: user_id, filename, create_time

One-to-many relationship with user isolation.

## Docker Commands

**Development**:
```bash
make dev-build-up    # Build & start with volumes
make dev-up          # Start existing containers
make dev-down        # Stop containers
make dev-logs        # View logs
```

**Production**:
```bash
make prod-build-up   # Build & start optimized
make prod-up         # Start containers
make prod-down       # Stop containers
make prod-logs       # View logs
```

Or use `docker-compose` directly:
```bash
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.prod.yml up -d
```

## Configuration

**Backend `.env`**:
```env
SQLALCHEMY_DATABASE_URL=postgresql://postgres:postgres@db:5432/typing
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

**Frontend `.env`**:
```env
VITE_API_URL=http://localhost:8000
```

## Multi-Stage Docker Builds

**Backend**: Single dockerfile supports dev & prod
- `dev`: Uvicorn with hot-reload
- `prod`: Gunicorn with worker processes

**Frontend**: Single dockerfile supports dev & prod
- `dev`: Vite with HMR
- `prod`: Static build served by Nginx

## Security

- JWT token authentication
- Bcrypt password hashing
- HTTPOnly cookies
- CORS middleware
- User data isolation
- Non-root production users

## Development Workflow

1. **Backend changes**: Auto-reload via volumes
2. **Frontend changes**: Hot reload via Vite
3. **Database**: Persistent PostgreSQL volume
4. **API testing**: Swagger at `/docs`

## Performance

- Database connection pooling (SQLAlchemy)
- Static asset optimization (Vite)
- Code splitting and lazy loading
- Multi-worker support in production
- IndexedDB for offline caching

## Contributing

- Follow existing code structure
- Use type hints (Python/TypeScript)
- Test changes locally before pushing
- Update relevant documentation

## Troubleshooting

**Port in use**: Kill process or change port mapping  
**DB connection fails**: Check PostgreSQL is running  
**API not responding**: Check backend logs with `make dev-logs`  
**Frontend blank**: Clear browser cache, rebuild  

See individual READMEs in [typing-backend](typing-backend/README.md) and [typing-ui](typing-ui/README.md) for detailed setup.

---

**Version**: 1.0.0  
**Node**: 22.15+  
**Python**: 3.12+  
**PostgreSQL**: 16+

---

## Development Workflow

### Frontend Development
```bash
cd typing-ui
npm install
npm run dev        # Start dev server
npm run lint       # Check code quality
npm run build      # Production build
npm run preview    # Preview prod build
```

### Backend Development
```bash
cd typing-backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Database Management
```bash
# Access database in development
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d typing

# View logs
make dev-logs
```

---

## Deployment Considerations

### Security Best Practices
- ✅ HTTPS configuration (use reverse proxy like Traefik)
- ✅ Environment variables for secrets
- ✅ CORS properly configured for your domain
- ✅ Database backups configured
- ✅ Non-root users in containers
- ✅ Regular dependency updates

### Performance Optimization
- ✅ Database connection pooling
- ✅ Caching strategies
- ✅ CDN for static assets
- ✅ Worker process scaling
- ✅ Database indexing

### Monitoring & Logging
- ✅ Container health checks enabled
- ✅ Log aggregation setup
- ✅ Error tracking (Sentry, etc.)
- ✅ Performance monitoring

---

## Troubleshooting

### Common Issues

**Frontend cannot connect to backend**
- Ensure backend is running: `docker-compose logs backend`
- Check proxy configuration in `vite.config.ts`
- Verify Docker network connectivity

**Database connection errors**
- Check PostgreSQL is healthy: `docker-compose ps`
- Verify environment variables in `.env`
- Check database credentials

**File upload fails**
- Verify file size < 10MB
- Check `files_data` volume has permissions
- Ensure backend is running and healthy

**PDF extraction issues**
- Check PDF file is valid
- Verify PyMuPDF is installed in backend
- Check backend logs for details

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow existing code style
- Write meaningful commit messages
- Update documentation for new features
- Test changes before submitting PR

---

## Project Roadmap

- [ ] Advanced typing metrics and analytics
- [ ] User leaderboard and achievements
- [ ] Social features (challenges, sharing)
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] API for third-party integrations
- [ ] AI-powered personalized practice suggestions


---

## Support & Resources

- **Documentation**: See individual [Backend README](typing-backend/README.md) and [Frontend README](typing-ui/README.md)
- **Issues**: [GitHub Issues](#)
- **Discussions**: [GitHub Discussions](#)
- **Email**: karun.m.2005-Retype@gmail.com

---

## Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com) and [React](https://react.dev)
- PDF processing powered by [PyMuPDF](https://pymupdf.readthedocs.io) and [PDF.js](https://mozilla.github.io/pdf.js/)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Deployment with [Docker](https://docker.com)

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Maintainers:** [Karun M]

---

## Quick Links

- [Backend Documentation](typing-backend/README.md)
- [Frontend Documentation](typing-ui/README.md)
