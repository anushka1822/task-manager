// server/src/server.ts
import app from './app';
import { PrismaClient } from '@prisma/client';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Create HTTP server (needed for Socket.io)
const server = http.createServer(app);

// Initialize Socket.io (We will add logic here later)
export const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
});

async function main() {
  try {
    // Check DB Connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start Server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed', error);
    process.exit(1);
  }
}

main();
