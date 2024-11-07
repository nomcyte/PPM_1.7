import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      className="fixed top-4 left-4 z-50 bg-pink-500 text-white rounded-full p-3 shadow-lg hover:bg-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
      onClick={onClick}
    >
      <ChevronLeft size={24} />
    </button>
  );
};

export default BackButton;
