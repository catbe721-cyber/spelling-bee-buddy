import React, { useState, useEffect } from 'react';
import { DictationList } from '../types.ts';
import { Button } from './Button.tsx';
import { speakWord } from '../utils/speechUtils.ts';
import { Volume2, Eye, EyeOff, ChevronRight, ChevronLeft, XCircle } from 'lucide-react';

interface Props {
  list: DictationList;
  onComplete: () => void;
  onExit: () => void;
}

export const DictationSession: React.FC<Props> = ({ list, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentWord = list.words[currentIndex];
  const progress = Math.round(((currentIndex + 1) / list.words.length) * 100);

  useEffect(() => {
    setIsRevealed(false);
    const timer = setTimeout(() => handleSpeak(), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleSpeak = () => {
    setIsPlaying(true);
    speakWord(currentWord);
    setTimeout(() => setIsPlaying(false), 1500);
  };

  const handleNext = () => {
    if (currentIndex < list.words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onExit}
          className="flex items-center text-slate-500 font-bold hover:text-slate-800 text-lg md:text-xl py-2 border-2 border-transparent focus:border-indigo-400 rounded-xl px-2 -mx-2 outline-none"
        >
          <XCircle size={28} className="mr-2" /> Quit
        </button>
        <div className="text-indigo-600 font-bold bg-indigo-100 px-4 py-2 rounded-full text-base md:text-lg">
          {currentIndex + 1} / {list.words.length}
        </div>
      </div>

      <div className="w-full h-6 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-xl border-b-8 border-slate-100 p-8 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50"></div>

        <div className="flex flex-col items-center w-full z-10">
          <div className={`
            text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-wide text-center transition-all duration-300
            ${isRevealed ? 'text-slate-800 scale-100 blur-0' : 'text-slate-300 scale-95 blur-md select-none'}
          `}>
            {isRevealed ? currentWord : '•••••••'}
          </div>
          <p className={`mt-6 text-slate-400 font-semibold text-lg md:text-xl transition-opacity ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
            {isRevealed ? 'Spelling revealed' : 'Hidden'}
          </p>
        </div>

        <div className="z-10 mt-4">
          <button
            onClick={handleSpeak}
            className={`
                w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 mx-auto group outline-none focus:ring-8 focus:ring-indigo-300
                ${isPlaying ? 'bg-indigo-600 scale-95 ring-8 ring-indigo-200' : 'bg-indigo-500 hover:bg-indigo-600 hover:-translate-y-2 active:scale-95 active:translate-y-0'}
              `}
          >
            <Volume2 size={80} color="white" strokeWidth={2.5} className={isPlaying ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
          </button>
          <p className="text-center mt-6 text-slate-500 font-bold text-xl md:text-2xl">Tap to Listen</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-4 pb-4">
        <Button
          variant={isRevealed ? "secondary" : "outline"}
          onClick={toggleReveal}
          fullWidth
          size="xl"
        >
          {isRevealed ? (
            <><EyeOff size={32} className="mr-3" /> Hide Word</>
          ) : (
            <><Eye size={32} className="mr-3" /> Show Word</>
          )}
        </Button>

        <div className="flex gap-4">
          {currentIndex > 0 && (
            <Button variant="secondary" onClick={handlePrev} size="xl" className="px-6 md:px-8">
              <ChevronLeft size={32} /> Back
            </Button>
          )}

          <Button variant="success" onClick={handleNext} fullWidth size="xl">
            {currentIndex === list.words.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={32} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};