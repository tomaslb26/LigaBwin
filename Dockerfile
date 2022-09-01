FROM ubuntu:16.04

# Install Opera
RUN apt-get update \
        && apt-get -y upgrade \
        && apt-get install -y snap snapd \
        && systemctl enable --now snapd.socket \
        && snap install opera


# -----------------------------------------------------------------------------
# Build
# -----------------------------------------------------------------------------
FROM python:3.9-slim as build-requirements-stage
COPY . .
RUN python -m pip install -U pip poetry
RUN poetry export --without-hashes -f requirements.txt | tail -n +3 > requirements.txt

# -----------------------------------------------------------------------------
# DEPLOY
# -----------------------------------------------------------------------------
FROM python:3.9-slim as deploy-stage
ENV PYTHONUNBUFFERED TRUE
WORKDIR /srv/

COPY --from=build-requirements-stage requirements.txt /srv/requirements.txt
RUN pip install --no-cache-dir -r /srv/requirements.txt

COPY ./scraping_scripts ./scraping_scripts

RUN useradd -r -u 1001 -g root worker
USER worker

ENTRYPOINT ["bash", "src/entrypoint.sh"]
