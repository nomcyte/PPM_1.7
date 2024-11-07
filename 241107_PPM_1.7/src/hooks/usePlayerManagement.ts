import { useState, useCallback } from 'react';
import { PlayerData } from '../types';

export const usePlayerManagement = () => {
  const [players, setPlayers] = useState<Record<number, PlayerData>>({});

  const addPlayer = useCallback((seat: number, playerData: PlayerData) => {
    setPlayers(prev => ({
      ...prev,
      [seat]: {
        name: playerData.name || '',
        actions: playerData.actions || [],
        memos: playerData.memos || [],
      },
    }));
  }, []);

  const updatePlayer = useCallback((seat: number, updateFn: (player: PlayerData) => PlayerData) => {
    setPlayers(prev => ({
      ...prev,
      [seat]: updateFn(prev[seat] || { name: '', actions: [], memos: [] }),
    }));
  }, []);

  const removePlayer = useCallback((seat: number) => {
    setPlayers(prev => {
      const newPlayers = { ...prev };
      delete newPlayers[seat];
      return newPlayers;
    });
  }, []);

  const getPlayerBySeat = useCallback((seat: number): PlayerData | null => {
    return players[seat] || null;
  }, [players]);

  const getAllPlayers = useCallback((): Record<number, PlayerData> => {
    return Object.fromEntries(
      Object.entries(players).filter(([_, player]) => player.name.trim() !== '')
    );
  }, [players]);

  return {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    getPlayerBySeat,
    getAllPlayers,
  };
};