import React, { useState, useEffect } from 'react';

interface Character {
  letter: string;
  name: string;
  image: string;
}

interface CharacterSpriteProps {
  character: Character;
  isWalking: boolean;
  isCorrect: boolean;
  onAnimationComplete: () => void;
  onAudioComplete: () => void;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  character,
  isWalking,
  isCorrect,
  onAnimationComplete,
  onAudioComplete
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [imageSrc, setImageSrc] = useState(character.image);

  useEffect(() => {
    setImageSrc(character.image);
  }, [character.image]);

  const handlePlayAudio = () => {
    const msg = new SpeechSynthesisUtterance(
      `Hi, I am a ${character.name}. Guess the first letter of my name. 
        The letter pronunciation is ${character.letter}.`
    );
    msg.lang = "en-US";
    msg.onend = () => {
      setIsPlayingAudio(false);
      onAudioComplete();
    };

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onAnimationComplete, 1000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, onAnimationComplete]);

  const getCharacterStyle = () => {
    if (isExiting) {
      return 'transform translate-x-full opacity-0 transition-all duration-1000 ease-in-out';
    }
    if (isWalking) {
      return 'transform -translate-x-full transition-transform duration-2000 ease-out';
    }
    if (isCorrect) {
      return 'animate-bounce';
    }
    return 'transform translate-x-0';
  };

  return (
    <div className="relative flex flex-col items-center">
      {!isCorrect && !isWalking && (
        <button
          onClick={handlePlayAudio}
          className="mb-4 bg-gradient-to-r from-rose-300 to-blue-200 text-white font-bold px-6 py-2 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          Hear the clue
        </button>
      )}

      {isPlayingAudio && !isCorrect && (
        <div className="mb-6 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-rose-200">
            <div className="flex items-center gap-3">
              <span className="text-slate-600 font-medium">Speaking...</span>
            </div>
          </div>
        </div>
      )}

      {isCorrect && (
        <div className="mb-4 relative animate-bounce">
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl px-8 py-4 shadow-lg border border-emerald-200">
            <p className="text-emerald-700 font-bold text-xl text-center">
              🎉 Great job! 🎉
              <br />
              {character.name} starts with {character.letter}!
            </p>
          </div>
        </div>
      )}

      <div className={`relative ${getCharacterStyle()}`}>
        <div className="relative w-56 h-56 rounded-3xl bg-white/50 backdrop-blur-sm p-4">
          <img
            src={imageSrc}
            alt={`${character.name} - Letter ${character.letter}`}
            className="w-full h-full object-contain drop-shadow-xl"
            onError={() => {
              setImageSrc(`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224" viewBox="0 0 224 224"><rect width="224" height="224" rx="24" fill="%23f8fafc"/><text x="112" y="112" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="80" font-weight="600" fill="%23475569">${character.letter}</text></svg>`);
            }}
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 w-40 h-6 bg-slate-300/40 rounded-full blur-sm"></div>

          {isWalking && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-200"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping animation-delay-400"></div>
              </div>
            </div>
          )}

          {isPlayingAudio && (
            <div className="absolute -top-4 -right-4">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-blue-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};