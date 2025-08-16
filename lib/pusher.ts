import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

// Pusher events
export const PUSHER_EVENTS = {
  ORDER_CREATED: 'order-created',
  ORDER_STATUS_UPDATED: 'order-status-updated',
  INVENTORY_LOW: 'inventory-low',
} as const;

// Pusher channels
export const PUSHER_CHANNELS = {
  ADMIN: 'admin-notifications',
  ORDER: (orderId: string) => `order-${orderId}`,
  USER: (userId: string) => `user-${userId}`,
} as const;