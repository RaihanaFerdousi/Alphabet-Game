import React from 'react';

interface LetterImage {
  letter: string;
  image: string;
}

interface LetterKeyboardProps {
  letterImages: LetterImage[];
  onLetterClick: (letter: string) => void;
  correctLetter: string;
  isGameActive: boolean;
  selectedLetter?: string;
}

export const LetterKeyboard: React.FC<LetterKeyboardProps> = ({
  letterImages,
  onLetterClick,
  correctLetter,
  isGameActive,
  selectedLetter
}) => {
  const getButtonStyle = (letter: string) => {
    const baseStyle = "relative p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md border-2 bg-white/80 backdrop-blur-sm";
    
    if (selectedLetter === letter && letter === correctLetter) {
      return `${baseStyle} border-emerald-400 bg-gradient-to-br from-emerald-100 to-teal-100 animate-pulse shadow-emerald-300/50`;
    }
    
    if (selectedLetter === letter && letter !== correctLetter) {
      return `${baseStyle} border-rose-400 bg-gradient-to-br from-rose-100 to-pink-100 animate-shake shadow-rose-300/50`;
    }
    
    if (isGameActive) {
      return `${baseStyle} border-slate-200 hover:border-blue-300 hover:bg-blue-50 shadow-slate-200/50 hover:shadow-blue-200/50`;
    }
    
    return `${baseStyle} border-slate-200 bg-slate-100 cursor-not-allowed opacity-50`;
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-slate-200">
      <h3 className="text-2xl font-bold text-center mb-6 text-slate-700">
        Choose the Letter
      </h3>
      
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 max-w-6xl mx-auto">
        {letterImages.map((letterData) => (
          <button
            key={letterData.letter}
            onClick={() => isGameActive && onLetterClick(letterData.letter)}
            disabled={!isGameActive}
            className={getButtonStyle(letterData.letter)}
            title={`Letter ${letterData.letter}`}
          >
            <div className="w-14 h-14 flex items-center justify-center">
              <img
                src={letterData.image}
                alt={`Letter ${letterData.letter}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const textElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (textElement) {
                    textElement.style.display = 'block';
                  }
                }}
              />
              
              <span 
                className="text-2xl font-bold text-slate-700 hidden"
                style={{ display: 'none' }}
              >
                {letterData.letter}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};