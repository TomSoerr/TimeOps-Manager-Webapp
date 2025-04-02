# TimeOps-Manager-Webapp

## TODO 

- Fix error not showing up after entry error

- readme

```
├── public
│   ├── apple-touch-icon.png
│   ├── desktop-screenshot.png
│   ├── favicon-96x96.png
│   ├── maks-icon.svg
│   ├── mobile-screenshot.png
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── src
│   ├── constants
│   │   ├── global.ts
│   │   └── tags.ts
│   ├── context
│   │   └── ConnectionContext.tsx
│   ├── database
│   │   ├── services
│   │   │   ├── analytics.ts
│   │   │   ├── entries.ts
│   │   │   ├── running.ts
│   │   │   ├── sync.ts
│   │   │   └── tags.ts
│   │   ├── utils
│   │   │   └── api-helpers.ts
│   │   ├── db-instance.ts
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── features
│   │   ├── analytics
│   │   │   └── Analytics.tsx
│   │   ├── entries
│   │   │   ├── EntryForm.tsx
│   │   │   ├── EntryModal.tsx
│   │   │   └── types.ts
│   │   ├── settings
│   │   │   ├── components
│   │   │   │   ├── ApiSettings.tsx
│   │   │   │   ├── DatabaseSettings.tsx
│   │   │   │   └── TagSettings.tsx
│   │   │   ├── hooks
│   │   │   │   ├── useApiSettings.ts
│   │   │   │   └── useDatabaseOperations.ts
│   │   │   └── pages
│   │   │       └── Settings.tsx
│   │   ├── tags
│   │   │   ├── EditTags.tsx
│   │   │   └── TagForm.tsx
│   │   └── timer
│   │       ├── components
│   │       │   ├── RunningEntrySection.tsx
│   │       │   ├── TimerActionButtons.tsx
│   │       │   └── WeeklyEntriesSection.tsx
│   │       ├── hooks
│   │       │   ├── useRunningEntry.ts
│   │       │   ├── useTimerEntries.ts
│   │       │   └── useTimer.ts
│   │       └── pages
│   │           ├── Timerrrrrr.tsx
│   │           └── Timer.tsx
│   ├── services
│   │   └── sseService.ts
│   ├── types
│   │   ├── color.types.ts
│   │   ├── database.types.ts
│   │   └── tags.ts
│   ├── ui
│   │   ├── buttons
│   │   │   ├── Button.tsx
│   │   │   ├── FabAdd.tsx
│   │   │   ├── FabStart.tsx
│   │   │   └── FAB.tsx
│   │   ├── entries
│   │   │   ├── Entry.tsx
│   │   │   └── RunningEntry.tsx
│   │   ├── feedback
│   │   │   └── Status.tsx
│   │   ├── inputs
│   │   │   ├── InputFile.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Select.tsx
│   │   ├── layout
│   │   │   ├── Card.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── SettingsSection.tsx
│   │   │   └── Table.tsx
│   │   ├── navigation
│   │   │   ├── NavItem.tsx
│   │   │   └── Nav.tsx
│   │   ├── Icon.tsx
│   │   └── Tag.tsx
│   ├── utils
│   │   ├── entryToCard.tsx
│   │   ├── groupEntries.ts
│   │   ├── ScrollToTop.tsx
│   │   └── time.ts
│   ├── index.css
│   └── index.tsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── prettierrc.json
├── README.md
└── vite.config.ts
```

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

# into .bashrc
sudo ip addr flush dev eth0
sudo ip addr add 192.168.178.43/24 dev eth0
sudo ip route add default via 192.168.178.1 dev eth0
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
openssl x509 -in "192.168.178.43.pem" -out rootCA.crt

# Add cert on Windows (run as Admin)
certutil -addstore -f "ROOT" "192.168.178.43.pem"

# List current port proxy
netsh interface portproxy show all

# Remove old port proxy
netsh interface portproxy delete v4tov4 listenport=5173 listenaddress=0.0.0.0

# Add new port proxy
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=192.168.178.43

netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=192.168.178.43

```
