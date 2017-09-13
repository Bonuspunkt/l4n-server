# l4n server


## debug
``` ps
$env:DEBUG = "l4n:*"
```
``` sh
export DEBUG=l4n:
```
``` js
localStorage.debug = '*'
```

## npm i

## nginx setup
``` conf
# site config
server {
        listen 443;
        server_name <hostname>;

        ssl on;
        ssl_certificate <path/to/fullchain.pem>;
        ssl_certificate_key <path/to/privkey.pem>;

        location / {
                proxy_http_version 1.1;
                proxy_pass http://127.0.0.1:8080;
                proxy_read_timeout 180s;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
}
```
