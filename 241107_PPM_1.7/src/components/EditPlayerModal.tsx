import React from 'react';
import { PlayerData } from '../types';

interface EditPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: PlayerData[];
  onEditPlayer: (player: PlayerData) => void;
}

const EditPlayerModal: React.FC<EditPlayerModalProps> = ({ isOpen, onClose, players, onEditPlayer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 id="modal-title" className="text-2xl font-bold mb-4">Edit Players</h2>
        <div className="space-y-2">
          {players.map((player, index) => (
            <button
              key={`${player.name}-${index}`}
              onClick={() => onEditPlayer(player)}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              {player.name}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerModal;