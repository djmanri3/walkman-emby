FROM nginx:latest

COPY ./index.html /usr/share/nginx/html/index.html
COPY ./manifest.json /usr/share/nginx/html
COPY ./sw.js /usr/share/nginx/html
COPY ./Walkman.png /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
