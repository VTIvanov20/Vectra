SERVER_CONTAINER := vectra-web-1

migrate:
	docker exec ${SERVER_CONTAINER} bash -c "poetry run python server/manage.py migrate"
