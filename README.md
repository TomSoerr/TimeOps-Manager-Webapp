# TimeOps-Manager-Webapp

## WSL

```ps
sudo netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=172.20.124.2
```

## HTTPS

```sh
openssl genrsa -out pc.fritz.box.key 2048
openssl req -new -key pc.fritz.box.key -out pc.fritz.box.csr -subj "/CN=pc.fritz.box"
openssl x509 -req -days 365 -in pc.fritz.box.csr -signkey pc.fritz.box.key -out pc.fritz.box.crt

openssl req -new -key pc.fritz.box.key -out pc.fritz.box.csr -subj "/CN=pc.fritz.box" -addext "subjectAltName=DNS:pc.fritz.box,DNS:localhost,IP:192.168.178.100" # replace ip with static ip of device

# move crt and key into root of project

```