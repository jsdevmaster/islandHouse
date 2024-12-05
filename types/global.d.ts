import { Socket as SocketIOClientSocket } from 'socket.io-client';
import { Server as SocketIOServer } from 'socket.io';

declare global {
  namespace SocketIO {
    interface Socket extends SocketIOClientSocket {}
    interface Server extends SocketIOServer {}
  }

  interface Window {
    io: any;
  }
}

export {};