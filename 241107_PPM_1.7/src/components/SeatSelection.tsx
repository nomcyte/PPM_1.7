import React from 'react';
import { PlayerData } from '../types';
import { ChevronRight } from 'lucide-react';
import TableLayout from './TableLayout';
import { seatPositions } from '../constants/tableLayout';

interface SeatSelectionProps {
  onStartGame: () => void;
  onSeatSelect: (seat: number) => void;
  onPlayerSelect: (seat: number) => void;
  playerData: Record<number, PlayerData>;
  selectedSeat: number | null;
  onEditRange: (seat: number) => void;
  onRemovePlayer: (seat: number) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  onStartGame,
  onSeatSelect,
  onPlayerSelect,
  playerData,
  selectedSeat,
  onEditRange,
  onRemovePlayer
}) => {
  const handleSeatClick = (seat: number) => {
    if (playerData[seat]) {
      onPlayerSelect(seat);
    } else {
      // 自分の座席を選択
      onSeatSelect(seat);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">自分の席を選択</h1>
      <TableLayout
        seatPositions={seatPositions}
        playerData={playerData}
        selectedSeat={selectedSeat}
        onSeatClick={handleSeatClick}
        onEditRange={onEditRange}
        onRemovePlayer={onRemovePlayer}
      />
      <button
        className="w-full bg-green-500 text-white py-3 px-6 rounded-lg flex items-center justify-center text-lg font-semibold shadow-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        onClick={onStartGame}
        disabled={selectedSeat === null}
      >
        ゲームを開始
        <ChevronRight className="ml-2" size={24} />
      </button>
    </div>
  );
};

export default SeatSelection;
