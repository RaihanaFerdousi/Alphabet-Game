import React, { useState, useEffect, useCallback } from 'react';
import { CharacterSprite } from './CharacterSprite';
import { LetterKeyboard } from './LetterKeyboard';
import { Fireworks } from './Fireworks';
import { GameBackground } from './GameBackground';
import { RotateCcw, Star, Trophy } from 'lucide-react';

import charactersData from '../data/characters.json';
import letterImagesData from '../data/letterImages.json';

interface Character {
  letter: string;
  name: string;
  image: string;
}

interface LetterImage {
  letter: string;
  image: string;
}

interface GameState {
  currentCharacter: Character | null;
  isWalking: boolean;
  isGameActive: boolean;
  selectedLetter: string | undefined;
  isCorrect: boolean;
  showFireworks: boolean;
  score: number;
  round: number;
  gamePhase: 'walking' | 'speaking' | 'playing' | 'correct' | 'transitioning';
}

export const CharacterAlphabetGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentCharacter: null,
    isWalking: false,
    isGameActive: false,
    selectedLetter: undefined,
    isCorrect: false,
    showFireworks: false,
    score: 0,
    round: 1,
    gamePhase: 'walking'
  });

  const characters: Character[] = charactersData;
  const letterImages: LetterImage[] = letterImagesData;

  const getRandomCharacter = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  }, [characters]);

  const startNewRound = useCallback(() => {
    const newCharacter = getRandomCharacter();
    setGameState(prev => ({
      ...prev,
      currentCharacter: newCharacter,
      isWalking: true,
      isGameActive: false,
      selectedLetter: undefined,
      isCorrect: false,
      showFireworks: false,
      gamePhase: 'walking'
    }));
  }, [getRandomCharacter]);

  const handleSpeechComplete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameActive: true,
      gamePhase: 'playing'
    }));
  }, []);

  const handleLetterClick = useCallback((clickedLetter: string) => {
    if (!gameState.isGameActive || !gameState.currentCharacter) return;

    setGameState(prev => ({
      ...prev,
      selectedLetter: clickedLetter,
      isGameActive: false
    }));

    if (clickedLetter === gameState.currentCharacter.letter) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          isCorrect: true,
          showFireworks: true,
          gamePhase: 'correct',
          score: prev.score + 10
        }));
      }, 500);
    } else {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          selectedLetter: undefined,
          isGameActive: true
        }));
      }, 1500);
    }
  }, [gameState.isGameActive, gameState.currentCharacter]);

  const handleCharacterAnimationComplete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'transitioning',
      round: prev.round + 1
    }));
    
    setTimeout(() => {
      startNewRound();
    }, 1000);
  }, [startNewRound]);

  const handleFireworksComplete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showFireworks: false
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      currentCharacter: null,
      isWalking: false,
      isGameActive: false,
      selectedLetter: undefined,
      isCorrect: false,
      showFireworks: false,
      score: 0,
      round: 1,
      gamePhase: 'walking'
    });
    setTimeout(startNewRound, 500);
  }, [startNewRound]);

  useEffect(() => {
    if (gameState.isWalking) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          isWalking: false,
          gamePhase: 'speaking'
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isWalking]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  return (
    <GameBackground>
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Letter Learning Adventure
          </h1>
          <p className="text-lg text-slate-600">
            Listen to the sounds and match the letters!
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-rose-200">
            <div className="flex items-center gap-2">
              <Star className="text-rose-500" />
              <span className="font-semibold text-slate-700">Score: {gameState.score}</span>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Trophy className="text-blue-500" />
              <span className="font-semibold text-slate-700">Round: {gameState.round}</span>
            </div>
          </div>
          
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <RotateCcw size={20} />
              New Game
            </div>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="flex justify-center min-h-[450px] items-center">
          {gameState.currentCharacter && (
              <CharacterSprite
              key={gameState.currentCharacter.letter}
              character={gameState.currentCharacter}
              isWalking={gameState.isWalking}
              isCorrect={gameState.isCorrect}
              onAnimationComplete={handleCharacterAnimationComplete}
              onAudioComplete={handleSpeechComplete}
            />
        )}
        </div>

          {(gameState.gamePhase === 'playing' || gameState.gamePhase === 'correct') && (
            <LetterKeyboard
              letterImages={letterImages}
              onLetterClick={handleLetterClick}
              correctLetter={gameState.currentCharacter?.letter || ''}
              isGameActive={gameState.isGameActive}
              selectedLetter={gameState.selectedLetter}
            />
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Watch the character walk in and listen to the sound they make. 
            Then click the letter that matches what you heard!
          </p>
        </div>

        <Fireworks 
          isActive={gameState.showFireworks} 
          onComplete={handleFireworksComplete}
        />
      </div>
    </GameBackground>
  );
};