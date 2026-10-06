# Build dependencies remain outside the runtime image.
FROM docker.io/library/node:22-bookworm-slim AS build
WORKDIR /app
RUN npm install --global pnpm@10.11.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY index.html tsconfig.json vite.config.ts tailwind.config.js postcss.config.js ./
COPY src ./src
RUN pnpm build

FROM docker.io/library/node:22-bookworm-slim AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3001 ROOM_DATA_DIR=/data
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server/rooms.mjs server/scoring.mjs server/security.mjs ./server/
COPY src/shared/activityRules.mjs ./src/shared/activityRules.mjs
RUN mkdir -p /data /app/runtime-secrets \
  && touch /app/runtime-secrets/cor-lab-creation-key \
  && chmod 0400 /app/runtime-secrets/cor-lab-creation-key \
  && chown node:node /data && chmod 700 /data
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node --input-type=module -e "const r=await fetch('http://127.0.0.1:3001/api/health',{signal:AbortSignal.timeout(4000)});if(!r.ok)process.exit(1);"
CMD ["node", "--max-old-space-size=256", "server/rooms.mjs"]
