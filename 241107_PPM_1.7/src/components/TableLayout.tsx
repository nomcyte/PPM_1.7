import React, { useState, useCallback } from 'react';
import { PlayerData } from '../types';
import { UserPlus, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface TableLayoutProps {
  seatPositions: { x: number; y: number }[];
  playerData: Record<number, PlayerData>;
  selectedSeat: number | null;
  onSeatClick: (seat: number) => void;
  onEditRange: (seat: number) => void;
  occupiedSeats: Set<number>;
  onVacateSeat: (seat: number) => void;
}

const TableLayout: React.FC<TableLayoutProps> = ({
  seatPositions,
  playerData,
  selectedSeat,
  onSeatClick,
  onEditRange,
  occupiedSeats,
  onVacateSeat,
}) => {
  const [activePlayer, setActivePlayer] = useState<number | null>(null);

  const handleSeatClick = useCallback((seat: number) => {
    setActivePlayer(activePlayer === seat ? null : seat);
  }, [activePlayer]);

  return (
    <div className="relative w-96 h-64 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full transform scale-x-[1.44] scale-y-[1.04] shadow-inner bg-emerald-600" />

      {seatPositions.map((position, index) => {
        const seat = index + 1;
        const isOccupied = occupiedSeats.has(seat);
        const player = isOccupied ? playerData[seat] : null;

        return (
          <React.Fragment key={seat}>
            {activePlayer === seat && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute flex flex-col gap-2 w-28 z-10"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y - 20}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                {isOccupied ? (
                  <>
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center justify-center text-sm shadow-md hover:bg-blue-600 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRange(seat);
                      }}
                      aria-label={`プレイヤー${seat}のレンジを編集`}
                    >
                      編集
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVacateSeat(seat);
                      }}
                      aria-label={`シート${seat}を空席にする`}
                    >
                      <LogOut size={16} className="mr-2" />
                      退席
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-green-500 text-white px-3 py-2 rounded-md flex items-center justify-center text-sm shadow-md hover:bg-green-600 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeatClick(seat);
                    }}
                    aria-label={`シート${seat}にプレイヤーを登録`}
                  >
                    <UserPlus size={16} className="mr-2" />
                    プレイヤーを登録
                  </button>
                )}
              </motion.div>
            )}
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold transition-all duration-300 shadow-md
                ${selectedSeat === seat
                  ? 'bg-blue-500 text-white ring-4 ring-blue-300'
                  : isOccupied
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-800'
                }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleSeatClick(seat)}
              aria-label={`シート${seat}${player ? ` (${player.name})` : ''}`}
            >
              {player ? player.name.charAt(0).toUpperCase() : seat}
            </motion.button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TableLayout;