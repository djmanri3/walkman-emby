FROM nginx:latest

COPY ./index.html /usr/share/nginx/html/index.html
COPY ./manifest.json /usr/share/nginx/html
COPY ./sw.js /usr/share/nginx/html
COPY ./icons /usr/share/nginx/html/icons
COPY ./backgrounds /usr/share/nginx/html/backgrounds

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
