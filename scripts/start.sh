#!/bin/sh
# Startup script for production deployment
# Runs Prisma migrations then starts Next.js

set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting Next.js application..."
exec npm start
