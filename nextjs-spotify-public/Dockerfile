# FROM node:18-alpine
FROM ghcr.io/hxrsmurf/playground-repo:nextjs-spotify-public

COPY package.json .
RUN npm install
COPY . .
ARG ACCESS_KEY
ENV ACCESS_KEY=$ACCESS_KEY
ENV ACCESS_KEY_ID=$ACCESS_KEY
ARG SECRET_KEY
ENV AWS_SECRET_ACCESS_KEY=$SECRET_KEY
ENV SECRET_KEY=$SECRET_KEY
ARG REGION
# ENV REGION=$REGION
# ENV REGION=us-east-1
ENV AWS_REGION=$REGION
ARG TABLE
ENV TABLE=$TABLE
ARG TABLE_INDEX
ENV TABLE_INDEX=$TABLE_INDEX
ARG DEVICE_DESKTOP
ENV DEVICE_DESKTOP=$DEVICE_DESKTOP
ARG DEVICE_LAPTOP
ENV DEVICE_LAPTOP=$DEVICE_LAPTOP
ARG DEVICE_TABLET
ENV DEVICE_TABLET=$DEVICE_TABLET
ARG DEVICE_SAMSUNG
ENV DEVICE_SAMSUNG=$DEVICE_SAMSUNG
ARG LATEST_MONTH
ARG LATEST_YEAR
ENV LATEST_MONTH=$LATEST_MONTH
ENV LATEST_YEAR=$LATEST_YEAR
ARG CACHE=0
RUN npm run build
CMD npm run start