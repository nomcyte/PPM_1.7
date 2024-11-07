import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PlayerData } from '../types';
import { motion } from 'framer-motion';

interface HandRangeChartProps {
  onHandSelection: (hands: string[]) => void;
  selectedAction: string | null;
  selectedPosition: string | null;
  existingRanges: PlayerData['actions'];
  onSave: () => void;
}

const HandRangeChart: React.FC<HandRangeChartProps> = ({
  onHandSelection,
  selectedAction,
  selectedPosition,
  existingRanges,
  onSave,
}) => {
  const [selectedHands, setSelectedHands] = useState<Set<string>>(new Set());
  const ranks = useMemo(() => ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'], []);

  useEffect(() => {
    if (selectedAction && selectedPosition) {
      const existingRange = existingRanges.find(
        range => range.action === selectedAction && range.position === selectedPosition
      );
      setSelectedHands(new Set(existingRange?.hands || []));
    }
  }, [selectedAction, selectedPosition, existingRanges]);

  const toggleHand = useCallback((hand: string) => {
    setSelectedHands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hand)) {
        newSet.delete(hand);
      } else {
        newSet.add(hand);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const handsArray = Array.from(selectedHands);
    onHandSelection(handsArray);
  }, [selectedHands, onHandSelection]);

  const getHandStyle = useCallback((hand: string, isSelected: boolean) => {
    let baseStyle = 'w-8 h-8 text-xs font-bold rounded transition-all duration-200 ';
    
    if (isSelected) {
      if (selectedAction === 'OPEN') return baseStyle + 'bg-blue-500 text-white';
      if (selectedAction === 'CALL on IP') return baseStyle + 'bg-green-500 text-white';
      if (selectedAction === 'CALL on OOP') return baseStyle + 'bg-orange-500 text-white';
      return baseStyle + 'bg-gray-500 text-white';
    }

    if (hand[0] === hand[1]) return baseStyle + 'bg-red-100 text-gray-700 hover:bg-red-200';
    if (hand.endsWith('s')) return baseStyle + 'bg-blue-100 text-gray-700 hover:bg-blue-200';
    return baseStyle + 'bg-green-100 text-gray-700 hover:bg-green-200';
  }, [selectedAction]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      <div className="grid grid-cols-13 gap-1">
        {ranks.map((row, i) =>
          ranks.map((col, j) => {
            const hand = i <= j ? `${row}${col}s` : `${col}${row}o`;
            const isSelected = selectedHands.has(hand);
            
            return (
              <motion.button
                key={hand}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={getHandStyle(hand, isSelected)}
                onClick={() => toggleHand(hand)}
              >
                {hand}
              </motion.button>
            );
          })
        )}
      </div>
      
      <div className="flex justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors duration-200"
          onClick={handleSubmit}
        >
          レンジを登録
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
          onClick={() => {
            setSelectedHands(new Set());
            onHandSelection([]);
          }}
        >
          リセット
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HandRangeChart;