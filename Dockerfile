FROM nginx:latest

COPY  ./build /usr/share/nginx/phidbac_admin
COPY ./proxy_params /etc/nginx/