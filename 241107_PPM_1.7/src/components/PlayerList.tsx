import React from 'react';
import { PlayerData } from '../types';

interface PlayerListProps {
  players: { [key: string]: PlayerData };
  onEditPlayer: (playerName: string) => void;
  onClose: () => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onEditPlayer, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">プレイヤー一覧</h2>
        <div className="space-y-2">
          {Object.entries(players).map(([playerName, player]) => (
            <button
              key={playerName}
              onClick={() => onEditPlayer(playerName)}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              {player.name}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default PlayerList;