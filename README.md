# 🗺️ MapChat - Proximity-Based Chat Application

**Real-time location-based chat with voice and text messaging**

---

## 🎯 Overview

MapChat is a modern web application that enables real-time proximity-based communication. Users can see each other on an interactive dark-themed map and chat with nearby users within a configurable proximity range (default: 100 meters).

### Key Features

- **📍 Real-time Location Tracking** - Live GPS positioning on dark map
- **💬 Proximity Chat** - Only chat with users within range
- **🎙️ Voice Messages** - Record and send audio messages
- **🎨 User Colors** - Each user has a unique color for easy identification
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **⚡ Real-time Sync** - WebSocket-based instant updates
- **🌙 Dark Theme** - Easy on the eyes, modern aesthetic

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Tailwind CSS 4 + Vite |
| **Backend** | Node.js + Express + Socket.io |
| **Maps** | Leaflet + OpenStreetMap (Dark theme) |
| **Real-time** | Socket.io (WebSockets) |
| **Audio** | Web Audio API + MediaRecorder |
| **Location** | Geolocation API |

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or pnpm
- Modern web browser with geolocation support

### Setup

```bash
# Clone repository
git clone https://github.com/bmcodex/MapChat.git
cd MapChat

# Install dependencies
npm install
# or
pnpm install

# Start development servers
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

Access the app at `http://localhost:3000`

---

## 🚀 Usage

1. **Allow Location Access** - Grant browser permission to access your location
2. **Join the Map** - You'll appear on the map with a unique color
3. **See Nearby Users** - Users within 100m will appear on your map
4. **Send Messages** - Type and send text messages to nearby users
5. **Send Voice** - Click "Record Voice" to send audio messages
6. **Move Around** - Your location updates in real-time as you move

---

## 📁 Project Structure

```
MapChat/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── styles/        # CSS/Tailwind
│   │   ├── App.tsx        # Main component
│   │   └── main.tsx       # Entry point
│   └── index.html         # HTML template
├── server/                 # Backend (Node.js)
│   └── index.ts           # Socket.io server
├── shared/                 # Shared types
│   └── types.ts           # TypeScript definitions
└── package.json           # Dependencies
```

---

## 🔌 API Events (Socket.io)

### Client → Server
- `user:join` - User joins the chat
- `user:move` - User location updated
- `message:send` - Send text message
- `message:voice` - Send voice message

### Server → Client
- `proximity:update` - List of nearby users
- `message:send` - Receive text message
- `message:voice` - Receive voice message

---

## 🎨 User Colors

Each user is assigned a unique color from the palette:
- Red, Teal, Blue, Light Salmon, Mint, Yellow, Purple, Sky Blue, Peach, Light Green

---

## 📊 Proximity Logic

- **Proximity Range**: 100 meters (configurable)
- **Distance Calculation**: Haversine formula
- **Update Frequency**: Real-time via WebSocket
- **Chat Visibility**: Only messages from nearby users are shown

---

## 🔐 Privacy & Security

- No persistent user accounts required
- Temporary session-based identities
- Location shared only with nearby users
- Messages only visible to proximity range
- No data stored on server

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with geolocation support

---

## 🚀 Deployment

### Heroku

```bash
git push heroku main
```

### Docker

```bash
docker build -t mapchat .
docker run -p 3000:3000 -p 3001:3001 mapchat
```

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please see CONTRIBUTING.md

---

## 📞 Support

- 🐛 [Report Issues](https://github.com/bmcodex/MapChat/issues)
- 💡 [Request Features](https://github.com/bmcodex/MapChat/issues)
- 📖 [Documentation](https://github.com/bmcodex/MapChat/wiki)

---

<div align="center">

**Made with ❤️ for proximity-based communication**

[GitHub](https://github.com/bmcodex/MapChat) • [Issues](https://github.com/bmcodex/MapChat/issues) • [Discussions](https://github.com/bmcodex/MapChat/discussions)

</div>
