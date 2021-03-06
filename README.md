# l4n server
[![Build Status](https://travis-ci.org/Bonuspunkt/l4n-server.svg?branch=master)](https://travis-ci.org/Bonuspunkt/l4n-server)

## install & setup
- install [node.js](https://nodejs.org/) version 8+

- set `NODE_ENV` environment variable to `production`

- if you are running on windows, you (usually) need to install the [windows build tools](https://github.com/felixrieseberg/windows-build-tools)
``` ps1
npm install windows-build-tools --global
# you might also have to add python to your path
$env:path += ";" + $env:USERPROFILE + "\.windows-build-tools\python27"
```

- then execute
``` sh
mkdir l4n
cd l4n
npm install l4n-server [additional l4n-server-modules]
npx l4n-server init
# edit ./settings.js
npx l4n-server build
npx webpack
node index.js
```

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
        proxy_read_timeout 210s; # 180s is the ping interval
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```
