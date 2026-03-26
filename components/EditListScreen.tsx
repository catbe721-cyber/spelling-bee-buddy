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
}

const SortableItem = ({ id, word, onRemove }: SortableItemProps) => {
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
    <div ref={setNodeRef} style={style} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl group mb-2 hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing touch-none p-1">
          <GripVertical size={20} />
        </button>
        <span className="font-medium text-slate-700">{word}</span>
      </div>
      <button
        onClick={onRemove}
        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export const EditListScreen: React.FC<Props> = ({ list, onSave, onCancel }) => {
  const [title, setTitle] = useState(list.title);
  const [date, setDate] = useState(list.date);
  const [words, setWords] = useState<string[]>([...list.words]);
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
      setWords((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim()) {
      setWords([...words, newWord.trim()]);
      setNewWord('');
    }
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim() || !date) return;

    onSave({
      ...list,
      title,
      date,
      words
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-blue-100 flex flex-col h-full max-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Edit List</h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 border-t-2 border-slate-100 pt-4">
        <h3 className="text-sm font-bold text-slate-600 mb-3">Words ({words.length})</h3>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={words}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {words.map((word, index) => (
                <SortableItem key={word} id={word} word={word} onRemove={() => handleRemoveWord(index)} />
              ))}
              {words.length === 0 && (
                <p className="text-slate-400 text-center py-4 italic">No words in this list yet.</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <form onSubmit={handleAddWord} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a new word..."
          value={newWord}
          onChange={e => setNewWord(e.target.value)}
          className="flex-1 p-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-0 outline-none font-medium"
        />
        <button
          type="submit"
          disabled={!newWord.trim()}
          className="p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:hover:bg-indigo-100 disabled:hover:text-indigo-600 transition-colors"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
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
