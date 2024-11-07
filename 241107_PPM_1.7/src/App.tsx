import { useState, useEffect, useCallback } from 'react';
import GameTracker from './components/GameTracker';
import PlayerAction from './components/PlayerAction';
import { Screen, Action, Position } from './types';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';
import { usePlayerManagement } from './hooks/usePlayerManagement';
import TableLayout from './components/TableLayout';
import { seatPositions } from './constants/tableLayout';
import { Users } from 'lucide-react';
import PlayerManagementModal from './components/PlayerManagementModal';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('gameTracker');
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<Set<number>>(new Set());
  const [isPlayerManagementOpen, setIsPlayerManagementOpen] = useState(false);

  const {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    getPlayerBySeat,
    getAllPlayers,
  } = usePlayerManagement();

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedPlayers = await loadFromLocalStorage('players', {});
        const loadedOccupiedSeats = await loadFromLocalStorage('occupiedSeats', []);
        
        if (loadedPlayers && typeof loadedPlayers === 'object') {
          Object.entries(loadedPlayers).forEach(([seat, playerData]) => {
            if (playerData) {
              addPlayer(Number(seat), playerData as any);
            }
          });
        }
        
        if (Array.isArray(loadedOccupiedSeats)) {
          setOccupiedSeats(new Set(loadedOccupiedSeats));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, [addPlayer]);

  const handlePlayerSelect = useCallback((seat: number) => {
    setSelectedPlayer(seat);
    setCurrentScreen('playerAction');
    setOccupiedSeats(prev => {
      const newSeats = new Set(prev);
      newSeats.add(seat);
      saveToLocalStorage('occupiedSeats', Array.from(newSeats));
      return newSeats;
    });
  }, []);

  const handleVacateSeat = useCallback((seat: number) => {
    setOccupiedSeats(prev => {
      const newSeats = new Set(prev);
      newSeats.delete(seat);
      saveToLocalStorage('occupiedSeats', Array.from(newSeats));
      return newSeats;
    });
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen('gameTracker');
    setSelectedPlayer(null);
  }, []);

  const handleEditRange = useCallback((seat: number) => {
    setSelectedPlayer(seat);
    setCurrentScreen('playerAction');
  }, []);

  const handleActionUpdate = useCallback((
    seat: number,
    action: Action,
    position: Position,
    hands: string[]
  ) => {
    updatePlayer(seat, (player) => ({
      ...player,
      actions: [...(player.actions || []), { action, position, hands }],
    }));
    saveToLocalStorage('players', getAllPlayers());
  }, [updatePlayer, getAllPlayers]);

  const handleMemoUpdate = useCallback((
    seat: number | null,
    playerName: string,
    memo: string,
    handRanges: any[]
  ) => {
    if (seat === null) return;
    updatePlayer(seat, (player) => ({
      ...player,
      name: playerName,
      actions: handRanges,
      memos: [
        ...(player.memos || []),
        { text: memo, handRanges },
      ],
    }));
    saveToLocalStorage('players', getAllPlayers());
  }, [updatePlayer, getAllPlayers]);

  const handleDeletePlayer = useCallback((seat: number) => {
    removePlayer(seat);
    handleVacateSeat(seat);
    saveToLocalStorage('players', getAllPlayers());
  }, [removePlayer, handleVacateSeat, getAllPlayers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      {currentScreen === 'gameTracker' && (
        <div className="space-y-8">
          <div className="text-center space-y-2 relative">
            <button
              onClick={() => setIsPlayerManagementOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="プレイヤー管理"
            >
              <Users size={20} />
            </button>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 filter drop-shadow-sm">
              Player Tracker
            </h1>
            <p className="text-gray-600 text-sm font-medium tracking-wide uppercase">
              Developed by ____
            </p>
          </div>
          <TableLayout
            seatPositions={seatPositions}
            playerData={players}
            selectedSeat={null}
            onSeatClick={handlePlayerSelect}
            onEditRange={handleEditRange}
            occupiedSeats={occupiedSeats}
            onVacateSeat={handleVacateSeat}
          />
        </div>
      )}
      {currentScreen === 'playerAction' && selectedPlayer !== null && (
        <PlayerAction
          seat={selectedPlayer}
          onActionUpdate={handleActionUpdate}
          onMemoUpdate={handleMemoUpdate}
          onBack={handleBack}
          savedPlayers={players}
          allPlayers={getAllPlayers()}
          editingPlayer={getPlayerBySeat(selectedPlayer)}
        />
      )}
      <PlayerManagementModal
        isOpen={isPlayerManagementOpen}
        onClose={() => setIsPlayerManagementOpen(false)}
        players={players}
        onDeletePlayer={handleDeletePlayer}
      />
    </div>
  );
};

export default App;