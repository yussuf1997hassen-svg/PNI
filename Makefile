.PHONY: staging production up down logs status clean

staging:
	@echo "🚀 Staging environment initialized"
	@docker compose config > /dev/null && echo "✅ docker-compose.yml valid"

production:
	@echo "🔒 Production environment initialized"
	@docker compose config > /dev/null && echo "✅ docker-compose.yml valid"

up:
	@echo "Starting PNI stack..."
	docker compose up -d
	@echo "✅ Stack started"

down:
	@echo "Stopping PNI stack..."
	docker compose down
	@echo "✅ Stack stopped"

logs:
	@echo "Fetching logs..."
	docker compose logs -f

status:
	@echo "---- PNI STACK STATUS ----"
	docker compose ps

clean:
	@echo "Cleaning up..."
	docker compose down --remove-orphans -v
	@echo "✅ Cleanup complete"
