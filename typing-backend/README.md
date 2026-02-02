# Backend API - FastAPI

FastAPI service for user authentication, PDF management, and text extraction.

## Quick Start

**Docker**:
```bash
docker build --target dev -t typing-backend:dev .
docker run -p 8000:8000 typing-backend:dev
```

**Local**:
```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**API Docs**: `http://localhost:8000/docs`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register user
- `POST /signin` - Login user
- `DELETE /signout` - Logout

### Documents (`/api/doc`)
- `POST /add` - Upload PDF (auth required)
- `GET /getList` - List user documents (auth required)
- `GET /get/{filename}` - Download document (auth required)
- `DELETE /delete/{filename}` - Delete document (auth required)

### PDF Processing (`/api/pdf`)
- `POST /extract` - Extract text from PDF

### Health
- `GET /health` - Service status

## Architecture

```
app/
├── routers/          # API endpoints (auth, doc, pdf)
├── services/         # Business logic (user, document, pdf)
├── database/         # Models, connections
├── dependencies/     # JWT authentication middleware
└── main.py          # FastAPI app setup
```

**Layers**: Routers → Services → Database (SQLAlchemy ORM)

## Database

**Users**: id, email, hashed_password  
**Documents**: user_id, filename, create_time  
Primary Key: (user_id, filename)

## Configuration

Create `.env` file:
```env
SQLALCHEMY_DATABASE_URL=postgresql://postgres:postgres@db:5432/typing
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

## Production

```bash
docker build --target prod -t typing-backend:prod .
docker run -p 8000:8000 \
  -e SQLALCHEMY_DATABASE_URL="..." \
  -e SECRET_KEY="..." \
  -e WEB_CONCURRENCY=4 \
  typing-backend:prod
```

**Multi-stage build** supports dev (hot-reload) and prod (Gunicorn) from single dockerfile.

## Stack

- FastAPI 0.121.0
- SQLAlchemy 2.0.44
- PostgreSQL 16
- PyMuPDF 1.26.7
- JWT authentication
- Bcrypt password hashing

### Running Tests
1. Access Swagger UI at `http://localhost:8000/docs`
2. Test endpoints directly through interactive interface
3. Monitor logs for debugging

### Hot Reload
Development mode watches for code changes and automatically reloads the server:
```bash
uvicorn app.main:app --reload
```

### Database Management
Tables are automatically created on application startup:
```python
Base.metadata.create_all(bind=engine)
```

### File Storage
Uploaded documents stored in `/app/files` directory (mounted as Docker volume in containers).

---

## Production Considerations

### Deployment Checklist
- [ ] Use strong, cryptographically secure `SECRET_KEY`
- [ ] Set appropriate `ACCESS_TOKEN_EXPIRE_MINUTES` for security policy
- [ ] Configure `WEB_CONCURRENCY` based on CPU cores (2-4 per core)
- [ ] Use environment-specific `.env` files (never commit credentials)
- [ ] Enable PostgreSQL backups and monitoring
- [ ] Implement request rate limiting
- [ ] Use HTTPS with valid SSL certificates
- [ ] Configure firewall rules
- [ ] Set up log aggregation and monitoring
- [ ] Regular security audits and dependency updates

### Performance Optimization
- **Connection Pooling**: SQLAlchemy handles database connection pooling
- **Worker Processes**: Adjust `WEB_CONCURRENCY` for throughput
- **Caching**: Consider Redis for session/cache management
- **Load Balancing**: Deploy multiple instances behind load balancer

---

## Health Monitoring

### Health Check Endpoint
```bash
curl http://localhost:8000/health
# Response: {"status":"ok"}
```

Use for container orchestration probes:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 10
```

---

## API Documentation

Interactive API documentation available at runtime:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

Both provide:
- Endpoint descriptions and parameters
- Request/response schemas
- Try-it-out functionality
- Authentication configuration

---

## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

**Database Connection Error**:
- Verify PostgreSQL is running
- Check `SQLALCHEMY_DATABASE_URL` format
- Ensure database exists and credentials are correct

**JWT Token Errors**:
- Verify `SECRET_KEY` matches between services
- Check token expiration time
- Ensure cookies are enabled in client

**PDF Extraction Issues**:
- Verify PDF file is not corrupted
- Check file permissions
- Monitor system memory for large files

---

## Contributing

When contributing code:
- Follow FastAPI best practices
- Use type hints for all functions
- Implement proper error handling
- Write clear commit messages
- Test thoroughly before submitting
- Update this README if adding features

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Python**: 3.12+  
**Database**: PostgreSQL 16+
