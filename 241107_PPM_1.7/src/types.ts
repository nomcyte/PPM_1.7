export interface PlayerData {
  name: string;
  actions: {
    action: string;
    position: string | null;
    hands: string[];
  }[];
  memos: {
    text: string;
    handRanges: {
      action: string;
      position: string | null;
      hands: string[];
    }[];
  }[];
}

export type Screen = 'gameTracker' | 'playerAction';
export type Action = 'OPEN' | 'CALL on IP' | 'CALL on OOP';
export type Position = 'UTG' | 'UTG+1' | 'UTG+2' | 'HJ' | 'LJ' | 'CO' | 'BTN' | 'SB' | 'BB';