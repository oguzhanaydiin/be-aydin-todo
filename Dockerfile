# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install ALL dependencies (including typescript)
COPY package*.json ./
RUN npm install

# Copy source and compile
COPY . .
RUN npm run build

# --- STAGE 2: Run ---
FROM node:20-alpine
WORKDIR /usr/src/app

# Only install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the compiled JS from the builder stage
# Assuming your TS compiles to a folder named 'dist'
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# Run the compiled javascript
CMD ["node", "dist/index.js"]