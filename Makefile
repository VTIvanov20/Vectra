SERVER_CONTAINER := vectra-web-1

migrate:
	docker exec ${SERVER_CONTAINER} bash -c "poetry run python server/manage.py migrate"

makemigrations:
	docker exec ${SERVER_CONTAINER} bash -c "poetry run python server/manage.py makemigrations"

dev-install:
	cd web && npm i

dev:
	cd web && npm run dev
