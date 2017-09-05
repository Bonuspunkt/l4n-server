# l4n server


## debug
```ps
$env:DEBUG = "l4n:*"
$env:PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "plz stop"
```
```cmd
cd node_modules\puppeteer
mklink /j .local-chromium \l4n\.local-chromium
```
