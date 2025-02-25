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
# Create cert inside project folder
mkcert -install
mkcert 192.168.178.43

# Folder where rootCA.pem is
mkcert -CAROOT

# Convert to CRT for Android and Windows
openssl x509 -in "rootCA.pem" -out rootCA.crt

# Add cert on Windows (run as Admin)
certutil -addstore -f "ROOT" "rootCA.pem"

# List current port proxy
netsh interface portproxy show all

# Remove old port proxy
netsh interface portproxy delete v4tov4 listenport=5173 listenaddress=0.0.0.0

# Add new port proxy
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=192.168.178.43

```
