import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { User, Message } from '../shared/types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

const users = new Map<string, User>();
const PROXIMITY_RANGE = 100; // meters

// Calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get nearby users
function getNearbyUsers(user: User): User[] {
  return Array.from(users.values()).filter(
    u =>
      u.id !== user.id &&
      calculateDistance(user.latitude, user.longitude, u.latitude, u.longitude) <=
        PROXIMITY_RANGE
  );
}

// Broadcast proximity update
function broadcastProximityUpdate(user: User) {
  const nearby = getNearbyUsers(user);
  io.to(user.id).emit('proximity:update', nearby);
}

io.on('connection', (socket: Socket) => {
  console.log('User connected:', socket.id);

  socket.on('user:join', (user: User) => {
    users.set(user.id, user);
    socket.join(user.id);
    console.log('User joined:', user.name);

    // Notify nearby users
    const nearby = getNearbyUsers(user);
    nearby.forEach(u => {
      io.to(u.id).emit('proximity:update', getNearbyUsers(u));
    });
  });

  socket.on('user:move', (user: User) => {
    users.set(user.id, user);
    const nearby = getNearbyUsers(user);
    io.to(user.id).emit('proximity:update', nearby);

    // Notify nearby users
    nearby.forEach(u => {
      io.to(u.id).emit('proximity:update', getNearbyUsers(u));
    });
  });

  socket.on('message:send', (message: Message) => {
    const sender = users.get(message.userId);
    if (!sender) return;

    const nearby = getNearbyUsers(sender);
    io.to(message.userId).emit('message:send', message);
    nearby.forEach(u => {
      io.to(u.id).emit('message:send', message);
    });
  });

  socket.on('message:voice', (message: Message) => {
    const sender = users.get(message.userId);
    if (!sender) return;

    const nearby = getNearbyUsers(sender);
    io.to(message.userId).emit('message:voice', message);
    nearby.forEach(u => {
      io.to(u.id).emit('message:voice', message);
    });
  });

  socket.on('disconnect', () => {
    let disconnectedUser: User | undefined;
    users.forEach((user, id) => {
      if (user.id === socket.id) {
        disconnectedUser = user;
        users.delete(id);
      }
    });

    if (disconnectedUser) {
      const nearby = getNearbyUsers(disconnectedUser);
      nearby.forEach(u => {
        io.to(u.id).emit('proximity:update', getNearbyUsers(u));
      });
      console.log('User disconnected:', disconnectedUser.name);
    }
  });
});

server.listen(3001, () => {
  console.log('MapChat server running on port 3001');
});
