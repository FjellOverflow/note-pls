FROM oven/bun:1.1

COPY package.json bun.lockb index.ts ./
RUN bun install --frozen-lockfile --production --ignore-scripts 

USER bun
ENTRYPOINT ["bun", "run", "index.ts"]