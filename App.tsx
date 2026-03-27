import React, { useState, useEffect } from 'react';
import { DictationList, AppState } from './types.ts';
import { SelectionScreen } from './components/SelectionScreen.tsx';
import { DictationSession } from './components/DictationSession.tsx';
import { CompletionScreen } from './components/CompletionScreen.tsx';
import { EditListScreen } from './components/EditListScreen.tsx';
import { BookOpen } from 'lucide-react';

// Default lists that appear if no local storage is found
const DEFAULT_LISTS: DictationList[] = [
  {
    id: '1',
    date: '2023-10-27',
    title: 'Week 1: Fruits & Colors',
    words: ['Apple', 'Banana', 'Cherry', 'Yellow', 'Purple', 'Green', 'Orange', 'Grape', 'Melon', 'Blue'],
  },
  {
    id: '2',
    date: '2023-11-03',
    title: 'Week 2: Animals',
    words: ['Elephant', 'Giraffe', 'Monkey', 'Tiger', 'Lion', 'Zebra', 'Kangaroo', 'Panda', 'Koala', 'Penguin'],
  }
];

export default function App() {
  const [lists, setLists] = useState<DictationList[]>(() => {
    const saved = localStorage.getItem('dictationLists');
    return saved ? JSON.parse(saved) : DEFAULT_LISTS;
  });

  const [appState, setAppState] = useState<AppState>('SELECTION');
  const [activeListId, setActiveListId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('dictationLists', JSON.stringify(lists));
  }, [lists]);

  const handleStartList = (id: string) => {
    setActiveListId(id);
    setAppState('PRACTICE');
  };

  const handleComplete = () => {
    setAppState('COMPLETION');
  };

  const handleHome = () => {
    setActiveListId(null);
    setAppState('SELECTION');
  };

  const handleAddList = (newList: DictationList) => {
    setLists([newList, ...lists]);
  };

  const handleEditList = (id: string) => {
    setActiveListId(id);
    setAppState('EDIT');
  };

  const handleUpdateList = (updatedList: DictationList) => {
    setLists(lists.map(l => l.id === updatedList.id ? updatedList : l));
    setAppState('SELECTION');
    setActiveListId(null);
  };

  const handleDeleteList = (id: string) => {
    if (confirm('Are you sure you want to delete this list?')) {
      setLists(lists.filter(l => l.id !== id));
    }
  };

  const activeList = lists.find(l => l.id === activeListId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center p-4 md:p-8 font-sans">
      <header className="w-full max-w-6xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg text-white">
            <BookOpen size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Spelling Bee Buddy
          </h1>
        </div>
      </header>

      <main className="w-full max-w-6xl flex-1 flex flex-col">
        {appState === 'SELECTION' && (
          <div className="w-full">
            <SelectionScreen
              lists={lists}
              onSelect={handleStartList}
              onAdd={handleAddList}
              onDelete={handleDeleteList}
              onEdit={handleEditList}
            />
          </div>
        )}

        {appState === 'PRACTICE' && activeList && (
          <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
            <DictationSession
              list={activeList}
              onComplete={handleComplete}
              onExit={handleHome}
            />
          </div>
        )}

        {appState === 'EDIT' && activeList && (
          <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
            <EditListScreen
              list={activeList}
              onSave={handleUpdateList}
              onCancel={handleHome}
            />
          </div>
        )}

        {appState === 'COMPLETION' && (
          <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
            <CompletionScreen
              onHome={handleHome}
              onRestart={() => setAppState('PRACTICE')}
            />
          </div>
        )}
      </main>

      <footer className="mt-8 text-slate-400 text-sm text-center">
        Made for Super Spellers! 🌟
      </footer>
    </div>
  );
}