import React, { useState } from 'react';
import { ChevronLeft, Plus, X, Utensils, Car, ShoppingBag, Receipt, Plane, PlusSquare, Dumbbell, MoreHorizontal, Wallet, Clapperboard, Trash2, Edit2, Check, ShoppingCart, Coffee } from 'lucide-react';
import { useAppContext, Category, TransactionType } from '../store/AppContext';
import { cn } from '../utils/cn';

const AVAILABLE_ICONS = [
  { name: 'Utensils', Icon: Utensils },
  { name: 'Car', Icon: Car },
  { name: 'ShoppingBag', Icon: ShoppingBag },
  { name: 'ShoppingCart', Icon: ShoppingCart },
  { name: 'Receipt', Icon: Receipt },
  { name: 'Plane', Icon: Plane },
  { name: 'PlusSquare', Icon: PlusSquare },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'Wallet', Icon: Wallet },
  { name: 'Clapperboard', Icon: Clapperboard },
  { name: 'Coffee', Icon: Coffee },
  { name: 'MoreHorizontal', Icon: MoreHorizontal },
];

const COLORS = [
  'bg-green-500 text-white',
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-yellow-500 text-white',
  'bg-indigo-500 text-white',
  'bg-red-500 text-white',
  'bg-orange-500 text-white',
  'bg-gray-500 text-white',
  'bg-fuchsia-500 text-white',
  'bg-emerald-500 text-white',
  'bg-teal-500 text-white',
  'bg-cyan-500 text-white',
];

export const CategorySettings = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { categories, addCategory, deleteCategory, updateCategory } = useAppContext();
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Utensils');
  const [color, setColor] = useState(COLORS[0]);

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingId) {
      updateCategory(editingId, { name, icon, color });
      setEditingId(null);
    } else {
      addCategory({ name, icon, color, type: activeTab });
    }
    
    setName('');
    setIcon('Utensils');
    setColor(COLORS[0]);
    setIsAdding(false);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setIcon('Utensils');
    setColor(COLORS[0]);
    setIsAdding(false);
  };

  const getIconComponent = (iconName: string) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    return found ? found.Icon : MoreHorizontal;
  };

  return (
    <div className="flex flex-col h-full bg-bg-dark">
      <div className="flex items-center p-6 pb-4 border-b border-border-dark sticky top-0 bg-bg-dark z-10">
        <button onClick={() => onNavigate('add')} className="p-2 -ml-2 text-text-primary hover:bg-surface-dark rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">카테고리 관리</h2>
      </div>

      <div className="p-6">
        {/* Type Toggle */}
        <div className="flex bg-surface-dark rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab('expense')}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
              activeTab === 'expense' ? "bg-white text-black" : "text-text-secondary"
            )}
          >
            지출
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-bold transition-colors",
              activeTab === 'income' ? "bg-white text-black" : "text-text-secondary"
            )}
          >
            수입
          </button>
        </div>

        {isAdding ? (
          <div className="bg-surface-dark rounded-2xl p-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{editingId ? '카테고리 수정' : '새 카테고리 추가'}</h3>
              <button onClick={cancelEdit} className="text-text-secondary">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-secondary mb-2">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="카테고리 이름"
                  className="w-full bg-bg-dark text-text-primary rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-2">아이콘</label>
                <div className="grid grid-cols-5 gap-2">
                  {AVAILABLE_ICONS.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setIcon(item.name)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        icon === item.name ? "bg-primary text-bg-dark" : "bg-bg-dark text-text-secondary hover:text-white"
                      )}
                    >
                      <item.Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-2">색상</label>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-transform",
                        color === c ? "scale-110 ring-2 ring-white" : "hover:scale-105"
                      )}
                    >
                      <div className={cn("w-full h-full rounded-full", c.split(' ')[0])} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2"
            >
              <Check size={20} />
              저장하기
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-border-dark flex items-center justify-center gap-2 text-text-secondary hover:text-white hover:border-primary transition-colors mb-6"
          >
            <Plus size={20} />
            새 카테고리 추가
          </button>
        )}

        <div className="space-y-3 mt-6">
          {categories
            .filter(c => c.type === activeTab)
            .map((cat) => {
              const Icon = getIconComponent(cat.icon);
              return (
                <div key={cat.id} className="bg-surface-dark rounded-2xl p-4 flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", cat.color)}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg truncate">{cat.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(cat)}
                      className="p-2 text-text-secondary hover:text-primary transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('이 카테고리를 삭제하시겠습니까?')) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
