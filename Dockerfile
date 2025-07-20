# Stage 1 - Building the app
FROM node:24.2-alpine3.21 AS builder

WORKDIR /app

# Create folder structure
RUN mkdir /src
RUN mkdir /src/components
RUN mkdir /src/constants
RUN mkdir /src/services

# Install dependencies
COPY package*.json .
RUN npm install

# Copy source code
COPY ./src/ ./src
COPY ./src/components/ ./src/components
COPY ./src/constants/ ./src/constants
COPY ./src/services/ ./src/services
COPY *.html .
COPY *.js .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 2 - Building nginx
FROM nginx:mainline-alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]