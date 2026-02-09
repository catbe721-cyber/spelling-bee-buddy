import React from 'react';
import { Button } from './Button.tsx';
import { Home, RefreshCw, Trophy } from 'lucide-react';

interface Props {
  onHome: () => void;
  onRestart: () => void;
}

export const CompletionScreen: React.FC<Props> = ({ onHome, onRestart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-200 blur-2xl rounded-full opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-full shadow-2xl border-4 border-yellow-100">
          <Trophy size={80} className="text-yellow-400 fill-yellow-100" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800">Great Job!</h2>
        <p className="text-xl text-slate-500 font-medium">You finished the whole list!</p>
      </div>

      <div className="w-full space-y-4 mt-8">
        <Button onClick={onRestart} variant="success" fullWidth size="xl">
          <RefreshCw size={28} className="mr-3" /> Practice Again
        </Button>
        
        <Button onClick={onHome} variant="secondary" fullWidth size="xl">
          <Home size={28} className="mr-3" /> Choose Another List
        </Button>
      </div>
    </div>
  );
};