import { io } from 'socket.io-client';

let wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
if (wsUrl && !wsUrl.startsWith('http://') && !wsUrl.startsWith('https://') && !wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
  wsUrl = 'https://' + wsUrl;
}

export const socket = io(wsUrl, {
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
