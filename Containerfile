# Use UBI Node.js 20 minimal image
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:latest

# Set the working directory
WORKDIR /opt/app-root/src

# Copy package files
COPY app/package*.json ./

# Install dependencies in production mode
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY app/src ./src
COPY app/public ./public
COPY app/next.config.ts ./
COPY app/tsconfig.json ./
COPY app/next-env.d.ts ./
COPY app/eslint.config.mjs ./
COPY app/tailwind.config.js ./
COPY app/postcss.config.mjs ./
USER root
RUN chown -R 1001:0 /opt/app-root/src
USER 1001
RUN ls -l /opt/app-root/src
# Build the Next.js application

RUN npm run build

# Remove source files to keep image lean
RUN rm -rf src && \
    rm -f next.config.ts tsconfig.json next-env.d.ts

# Expose the port the app runs on
EXPOSE 3000

# Switch to non-root user
USER 1001

# Start the application
CMD ["npm","run", "start"]
