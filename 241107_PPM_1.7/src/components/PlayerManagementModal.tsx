import React from 'react';
import { PlayerData } from '../types';
import { X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlayerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Record<number, PlayerData>;
  onDeletePlayer: (seat: number) => void;
}

const PlayerManagementModal: React.FC<PlayerManagementModalProps> = ({
  isOpen,
  onClose,
  players,
  onDeletePlayer,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">プレイヤー管理</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {Object.entries(players).length === 0 ? (
          <p className="text-gray-500 text-center py-4">登録されているプレイヤーはいません</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(players).map(([seat, player]) => (
              <div
                key={seat}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-800">{player.name}</p>
                  <p className="text-sm text-gray-500">シート {seat}</p>
                </div>
                <button
                  onClick={() => onDeletePlayer(Number(seat))}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                  aria-label="プレイヤーを削除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PlayerManagementModal;