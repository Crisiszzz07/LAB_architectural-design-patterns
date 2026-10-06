import { createContext, useContext } from 'react';
import { RoomInfo } from './roomApi';
export interface ActivityRoom {
  room: RoomInfo;
  team: string;
  namespace: string;
  initial: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  status: string;
}
export const ActivityRoomContext = createContext<ActivityRoom | null>(null);
export const useActivityRoom = () => useContext(ActivityRoomContext);
