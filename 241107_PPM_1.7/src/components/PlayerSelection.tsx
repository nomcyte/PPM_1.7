import React from 'react';
import { PlayerData } from '../types';
import { ChevronRight } from 'lucide-react';
import TableLayout from './TableLayout';
import { seatPositions } from '../constants/tableLayout';

interface PlayerSelectionProps {
  selectedSeat: number;
  onPlayerSelect: (seat: number) => void;
  playerData: { [key: number]: PlayerData };
  onEditRange: (seat: number) => void;
  onRemovePlayer: (seat: number) => void;
}

const PlayerSelection: React.FC<PlayerSelectionProps> = ({
  selectedSeat,
  onPlayerSelect,
  playerData,
  onEditRange,
  onRemovePlayer
}) => {
  

  const handleSeatClick = (seat: number) => {
    const player = playerData[seat];
    if (player) {
      onEditRange(seat);
    } else {
      onPlayerSelect(seat);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">トラッキングするプレイヤーを選択</h2>
      <TableLayout
        seatPositions={seatPositions}
        playerData={playerData}
        selectedSeat={selectedSeat}
        onSeatClick={handleSeatClick}
        onEditRange={onEditRange}
        onRemovePlayer={onRemovePlayer}
      />
    </div>
  );
};

export default PlayerSelection;
