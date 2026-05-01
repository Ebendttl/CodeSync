import { useEffect } from 'react';
// @ts-ignore
import { useRoomStore } from '../store/roomStore';
// @ts-ignore
import { socket } from '../lib/api';

export function useCollaboration(roomId: string, token: string) {
  const { addUser, removeUser } = useRoomStore();

  useEffect(() => {
    socket.emit('room:join', roomId, token);

    const onUserJoined = (user: any) => addUser(user);
    const onUserLeft = (userId: string) => removeUser(userId);

    socket.on('room:user-joined', onUserJoined);
    socket.on('room:user-left', onUserLeft);

    return () => {
      socket.emit('room:leave');
      socket.off('room:user-joined', onUserJoined);
      socket.off('room:user-left', onUserLeft);
    };
  }, [roomId, token, addUser, removeUser]);
}
