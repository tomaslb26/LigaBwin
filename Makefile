REQUIREMENTS_FILE=requirements.txt
DOCKER_NAME=liga-bwin-scraper
HASH=$(shell git log -n 1 --pretty=format:"%h")

build:
	docker build --file ./Dockerfile \
		-t ${DOCKER_NAME}:${HASH} \
		.
run:
	docker run \
		--rm \
		-it \
		--name ${DOCKER_NAME}-local \
		--entrypoint bash \
		${DOCKER_NAME}:${HASH}



requirements:
	poetry export -f requirements.txt | tail -n +3 > ${REQUIREMENTS_FILE}

requirements-dev:
	poetry export --dev -f requirements.txt | tail -n +3 > ${REQUIREMENTS_DEV_FILE}

lint:
	poetry run flake8

pre-commit:
	pre-commit run --all-files
