import React, { useState } from 'react';
import { DictationList } from '../types.ts';
import { Button } from './Button.tsx';
import { Save, Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  list: DictationList;
  onSave: (updatedList: DictationList) => void;
  onCancel: () => void;
}

interface SortableItemProps {
  id: string;
  word: string;
  onRemove: () => void;
  onUpdate: (newText: string) => void;
}

const SortableItem = ({ id, word, onRemove, onUpdate }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between bg-slate-50 p-2 sm:p-3 rounded-xl group mb-2 hover:bg-slate-100 transition-colors border-2 border-transparent focus-within:border-indigo-100">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <button {...attributes} {...listeners} className="text-slate-400 hover:text-indigo-500 cursor-grab active:cursor-grabbing touch-none p-2 sm:p-1 rounded-lg">
          <GripVertical size={20} />
        </button>
        <input
          type="text"
          value={word}
          onChange={(e) => onUpdate(e.target.value)}
          className="font-medium text-slate-700 bg-transparent py-1 px-2 border-b-2 border-transparent hover:border-slate-300 focus:border-indigo-400 focus:outline-none flex-1 min-w-0 transition-colors rounded-none"
          placeholder="Enter word..."
        />
      </div>
      <button
        onClick={onRemove}
        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Remove word"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export const EditListScreen: React.FC<Props> = ({ list, onSave, onCancel }) => {
  const [title, setTitle] = useState(list.title);
  const [date, setDate] = useState(list.date);
  
  // Create an array of objects with stable IDs for sortable items
  const [wordItems, setWordItems] = useState<{id: string, text: string}[]>(() => 
    list.words.map(w => ({ id: Math.random().toString(36).substring(2, 9), text: w }))
  );
  const [newWord, setNewWord] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWordItems((items) => {
        const oldIndex = items.findIndex((x) => x.id === active.id);
        const newIndex = items.findIndex((x) => x.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim()) {
      setWordItems([...wordItems, { id: Math.random().toString(36).substring(2, 9), text: newWord.trim() }]);
      setNewWord('');
    }
  };

  const handleRemoveWord = (id: string) => {
    setWordItems(wordItems.filter((w) => w.id !== id));
  };
  
  const handleUpdateWord = (id: string, newText: string) => {
    setWordItems(wordItems.map((w) => (w.id === id ? { ...w, text: newText } : w)));
  };

  const handleSave = () => {
    if (!title.trim() || !date) return;

    onSave({
      ...list,
      title,
      date,
      words: wordItems.map((w) => w.text.trim()).filter((w) => w.length > 0)
    });
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-blue-100 flex flex-col h-full max-h-[85vh]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Edit List</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 shrink-0">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-bold text-slate-600 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-600 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 border-t-2 border-slate-100 pt-4 px-1 min-h-0">
        <h3 className="text-sm font-bold text-slate-600 mb-3">Words ({wordItems.length})</h3>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={wordItems.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {wordItems.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  word={item.text}
                  onUpdate={(text) => handleUpdateWord(item.id, text)}
                  onRemove={() => handleRemoveWord(item.id)}
                />
              ))}
              {wordItems.length === 0 && (
                <p className="text-slate-400 text-center py-8 italic font-medium bg-slate-50 rounded-xl">No words in this list yet.</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <form onSubmit={handleAddWord} className="flex gap-2 mb-6 shrink-0">
        <input
          type="text"
          placeholder="Add a new word..."
          value={newWord}
          onChange={e => setNewWord(e.target.value)}
          className="flex-1 p-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium transition-colors"
        />
        <button
          type="submit"
          disabled={!newWord.trim()}
          className="p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:hover:bg-indigo-100 disabled:hover:text-indigo-600 transition-colors shrink-0"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="flex gap-3 pt-4 border-t-2 border-slate-100 shrink-0">
        <Button onClick={onCancel} variant="outline" fullWidth>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="primary" fullWidth>
          <Save size={20} className="mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
};
