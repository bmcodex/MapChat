# MapChat Deployment Guide

## Prerequisites
- Node.js 18+
- npm or pnpm
- Git

## Local Development
```bash
npm install
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2
```

## Production Deployment

### Heroku
```bash
heroku create mapchat-app
git push heroku main
```

### Docker
```bash
docker build -t mapchat .
docker run -p 3000:3000 -p 3001:3001 mapchat
```

### AWS EC2
1. Launch EC2 instance
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Run with PM2

## Environment Variables
- PORT: Server port (default: 3001)
- NODE_ENV: production/development
- PROXIMITY_RANGE: Chat range in meters (default: 100)
