import React, { useState } from 'react';
import { DictationList } from '../types.ts';
import { Button } from './Button.tsx';
import { Plus, Trash2, Calendar, ChevronRight, X, Edit } from 'lucide-react';

interface Props {
  lists: DictationList[];
  onSelect: (id: string) => void;
  onAdd: (list: DictationList) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const SelectionScreen: React.FC<Props> = ({ lists, onSelect, onAdd, onDelete, onEdit }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newWords, setNewWords] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newWords.trim()) return;

    const wordsArray = newWords
      .split(/[\n,]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);

    const newList: DictationList = {
      id: Date.now().toString(),
      date: newDate,
      title: newTitle || `List for ${newDate}`,
      words: wordsArray,
    };

    onAdd(newList);
    setIsAdding(false);
    setNewDate('');
    setNewTitle('');
    setNewWords('');
  };

  if (isAdding) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-blue-100 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">New Dictation List</h2>
          <button onClick={() => setIsAdding(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Date</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Science Words"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Words (Paste here)</label>
            <textarea
              rows={6}
              placeholder="Paste words here, separated by commas or new lines..."
              value={newWords}
              onChange={e => setNewWords(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium text-lg"
            />
          </div>
          <Button type="submit" size="lg" fullWidth variant="success" className="mt-2">
            Save List
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-700">Your Lists</h2>
          <p className="text-slate-500 text-sm">Select a week to practice</p>
        </div>
        <Button onClick={() => setIsAdding(true)} size="sm" variant="primary">
          <Plus size={20} className="mr-1" /> New List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {lists.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">No lists yet! Click "New List" to start.</p>
          </div>
        ) : (
          lists.map(list => (
            <div
              key={list.id}
              className="group bg-white rounded-2xl p-4 pl-6 shadow-lg border-2 border-transparent hover:border-indigo-200 transition-all flex items-center justify-between cursor-pointer"
              onClick={() => onSelect(list.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm uppercase tracking-wider mb-1">
                  <Calendar size={14} />
                  {new Date(list.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{list.title}</h3>
                <p className="text-slate-400 font-medium mt-1">{list.words.length} words</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(list.id); }}
                  className="p-3 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(list.id); }}
                  className="p-3 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <ChevronRight size={24} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};