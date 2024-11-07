import React, { useState, useEffect } from 'react';
import PlayerSelection from './PlayerSelection';
import PlayerAction from './PlayerAction';
import { PlayerData } from '../types';

interface GameTrackerProps {
  selectedSeat: number;
  playerData: Record<number, PlayerData>;
  savePlayerData: (newPlayerData: Record<number, PlayerData>) => void;
  onBackToSeatSelection: () => void;
  selectedPlayer: number | null;
  onEditRange: (seat: number) => void;
  onRemovePlayer: (seat: number) => void;
}

const GameTracker: React.FC<GameTrackerProps> = ({
  selectedSeat,
  playerData,
  savePlayerData,
  onBackToSeatSelection,
  selectedPlayer,
  onEditRange,
  onRemovePlayer,
}) => {
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);

  useEffect(() => {
    if (selectedPlayer !== null) {
      setIsEditingPlayer(true);
    }
  }, [selectedPlayer]);

  const handlePlayerSelect = (seat: number) => {
    onEditRange(seat);
  };

  const handleBackToSelection = () => {
    setIsEditingPlayer(false);
    onBackToSeatSelection();
  };

  const handleActionUpdate = (seat: number, action: string, position: string | null, hands: string[]) => {
    savePlayerData({
      ...playerData,
      [seat]: {
        ...playerData[seat],
        actions: [...(playerData[seat]?.actions || []), { action, position, hands }],
      },
    });
  };

  const handleMemoUpdate = (seat: number, playerName: string, memo: string, handRanges: PlayerData['actions']) => {
    savePlayerData({
      ...playerData,
      [seat]: {
        ...playerData[seat],
        name: playerName,
        actions: handRanges,
        memos: [...(playerData[seat]?.memos || []), { text: memo, handRanges }],
      },
    });
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">ゲームトラッカー</h1>
        <p className="text-lg text-gray-600 mt-2">あなたの席: {selectedSeat}</p>
      </div>
      {!isEditingPlayer ? (
        <PlayerSelection
          selectedSeat={selectedSeat}
          onPlayerSelect={handlePlayerSelect}
          playerData={playerData}
          onEditRange={onEditRange}
          onRemovePlayer={onRemovePlayer}
        />
      ) : (
        <PlayerAction
          seat={selectedPlayer}
          onActionUpdate={handleActionUpdate}
          onMemoUpdate={handleMemoUpdate}
          onBack={handleBackToSelection}
          onRemovePlayer={onRemovePlayer}
          savedPlayers={playerData}
          allPlayers={playerData}
          editingPlayer={selectedPlayer !== null ? playerData[selectedPlayer] : null}
        />
      )}
    </div>
  );
};

export default GameTracker;
