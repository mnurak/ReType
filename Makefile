DOCKER_DEV=docker-compose.dev.yml
DOCKER_PROD=docker-compose.prod.yml
# DEV
dev-build-up:
	docker compose -f $(DOCKER_DEV) up --build -d

dev-up:
	docker compose -f $(DOCKER_DEV) up -d

dev-down:
	docker compose -f $(DOCKER_DEV) down

dev-volume-down:
	docker compose -f $(DOCKER_DEV) down -v

# PROD
prod-build-up:
	docker compose -f $(DOCKER_PROD) up --build -d

prod-up:
	docker compose -f $(DOCKER_PROD) up

prod-down:
	docker compose -f $(DOCKER_PROD) down

prod-volume-down:
	docker compose -f $(DOCKER_PROD) down -v

# Optional: logs
dev-logs:
	docker compose -f $(DOCKER_DEV) logs -f

prod-logs:
	docker compose -f $(DOCKER_PROD) logs -f
