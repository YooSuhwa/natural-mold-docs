FROM node:22-alpine

ENV NODE_ENV=development \
    PORT=3001 \
    npm_config_fund=false \
    npm_config_update_notifier=false \
    npm_config_cache=/tmp/npm-cache \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

WORKDIR /app

RUN apk add --no-cache ca-certificates curl tar gzip \
  && npm install --global --omit=dev mint@4.2.406 \
  && npm cache clean --force \
  && mkdir -p /home/node/.mintlify \
  && mint_version="$(curl -fsSk https://releases.mintlify.com/mint-version.txt)" \
  && curl -fsSkL "https://releases.mintlify.com/mint-${mint_version}.tar.gz" -o /home/node/.mintlify/mint.tar.gz \
  && tar -xzf /home/node/.mintlify/mint.tar.gz -C /home/node/.mintlify \
  && rm /home/node/.mintlify/mint.tar.gz \
  && rm -rf /root/.cache /root/.npm /tmp/* \
  && chown -R node:node /home/node/.mintlify

COPY --chown=node:node src ./src

EXPOSE 3001

USER node
WORKDIR /app/src

CMD ["sh", "-c", "mint dev --port ${PORT:-3001} --no-open"]
