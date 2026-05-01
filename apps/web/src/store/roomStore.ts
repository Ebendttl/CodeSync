import { create } from 'zustand';
// @ts-ignore
import type { CollabUser } from '@codesync/shared-types';


interface RoomState {
  roomId: string | null;
  language: string;
  users: Map<string, CollabUser>;
  setRoomId: (id: string) => void;
  setLanguage: (lang: string) => void;
  addUser: (user: CollabUser) => void;
  removeUser: (id: string) => void;
  setUsers: (users: CollabUser[]) => void;
  // force cache bust
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  language: 'javascript',
  users: new Map(),
  setRoomId: (id) => set({ roomId: id }),
  setLanguage: (language) => set({ language }),
  addUser: (user) => set((state) => {
    const newUsers = new Map(state.users);
    newUsers.set(user.id, user);
    return { users: newUsers };
  }),
  removeUser: (id) => set((state) => {
    const newUsers = new Map(state.users);
    newUsers.delete(id);
    return { users: newUsers };
  }),
  setUsers: (users) => set(() => {
    const newMap = new Map();
    users.forEach(u => newMap.set(u.id, u));
    return { users: newMap };
  }),
}));
