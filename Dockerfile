# Stage 1: Build
FROM node:lts-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY package.json package-lock.json ./


# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY src ./src
COPY public ./public
COPY prisma ./prisma
COPY next.config.ts ./next.config.ts
COPY postcss.config.mjs ./postcss.config.mjs
COPY tailwind.config.ts ./tailwind.config.ts
COPY tsconfig.json ./tsconfig.json
COPY .env ./.env

# Build the Next.js application
RUN npm run build

# Stage 2: Production
FROM node:lts-alpine AS runner

# Set environment variable for Next.js production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/ ./

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
