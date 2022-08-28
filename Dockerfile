# Base docker image
FROM debian:sid
MAINTAINER fearphage <fearphage+dockerfiles@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
ENV CHANNEL stable
ENV OPERA_CHANNEL opera-$CHANNEL

# Install Opera
RUN apt-get update \
        && apt-get install gnupg2 \
        && apt-get install -y \
                ca-certificates \
                wget \
        && echo "deb http://deb.opera.com/${OPERA_CHANNEL}/ stable non-free" > /etc/apt/sources.list.d/opera.list \
        && wget -qO- http://deb.opera.com/archive.key | apt-key add - \
        && apt-get update \
        && apt-get install -y \
                ${OPERA_CHANNEL} \
                --no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

COPY local.conf /etc/fonts/local.conf

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

