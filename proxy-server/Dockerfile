FROM nginx:1.25-alpine-slim
ENV NGINX_ENVSUBST_OUTPUT_DIR="/etc/nginx"

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf.template /etc/nginx/templates/