import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001', {
  autoConnect: false,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  transports: ['websocket'],
});

export const connectSocket = (token: string) => {
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
