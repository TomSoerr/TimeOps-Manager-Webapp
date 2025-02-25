# TimeOps-Manager-Webapp

## WSL

```powershell
sudo netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=172.20.124.2

# install and enable Hyper-V for WSL2 bridge
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All

# List network adapters
Get-NetAdapter | Select-Object Name, InterfaceDescription

# Create new external virtual switch
New-VMSwitch -Name "WSL_Bridge" -NetAdapterName "Wi-Fi" -AllowManagementOS $true
```

### .wslconfig

Inside user home folder:
```ini
[wsl2]
networkingMode=bridged
vmSwitch="WSL_Bridge"
dhcp=true
```

## HTTPS

```sh
# Generate private key
openssl genrsa -out ip.key 2048

# Generate CSR with IP only
openssl req -new -key ip.key -out ip.csr \
  -subj "/CN=192.168.178.43" \
  -addext "subjectAltName=IP:192.168.178.43,IP:127.0.0.1"

# Generate certificate
openssl x509 -req -days 365 \
  -in ip.csr \
  -signkey ip.key \
  -out ip.crt \
  -extfile <(printf "subjectAltName=IP:192.168.178.43,IP:127.0.0.1")

# List current port proxy
netsh interface portproxy show all

# Remove old port proxy
netsh interface portproxy delete v4tov4 listenport=5173 listenaddress=0.0.0.0

# Add new port proxy
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=192.168.178.43

```
