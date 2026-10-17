FROM node:22-bookworm-slim
WORKDIR /app
COPY . .
RUN npm run setup
ENV PORT=9000
EXPOSE 9000
CMD ["npm","start"]
