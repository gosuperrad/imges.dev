# Use Node.js 22 with Debian base (better for Canvas dependencies)
FROM node:22-bullseye-slim

# Install system dependencies required for Canvas and Sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpixman-1-dev \
    pkg-config \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies with legacy peer deps flag
RUN npm ci --legacy-peer-deps --omit=dev || npm install --legacy-peer-deps --omit=dev

# Copy application code
COPY . .

# Make startup script executable
RUN chmod +x scripts/start.sh

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start with migrations then Next.js
CMD ["./scripts/start.sh"]
