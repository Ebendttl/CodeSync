export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatarColor: string;
  text: string;
  timestamp: number;
  type: 'message' | 'system';
}

export interface CollabUser {
  id: string;
  username: string;
  avatarColor: string;
}
// cache bust

export interface RelativePosition {
  type: any;
  tname: string | null;
  item: any;
  assoc: number;
}

export interface AwarenessUser {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

export interface AwarenessState {
  user: AwarenessUser;
  cursor: {
    anchor: RelativePosition | null;
    head: RelativePosition | null;
  };
}
