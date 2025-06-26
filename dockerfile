# Install dependencies
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
