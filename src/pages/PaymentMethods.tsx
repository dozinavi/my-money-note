import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const PaymentMethods = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { paymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'VISA' | 'AMEX' | 'MASTER' | 'BANK'>('VISA');

  const handleAdd = () => {
    if (newName) {
      addPaymentMethod({
        name: newName,
        type: newType,
        isDefault: paymentMethods.length === 0,
      });
      setNewName('');
      setShowAddForm(false);
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'VISA': return 'bg-blue-600';
      case 'AMEX': return 'bg-gray-700';
      case 'MASTER': return 'bg-red-500';
      case 'BANK': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-dark">
      <div className="flex items-center p-6 pb-4 border-b border-border-dark sticky top-0 bg-bg-dark z-10">
        <button onClick={() => onNavigate('settings')} className="p-2 -ml-2 text-text-primary hover:bg-surface-dark rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">결제 수단 관리</h2>
      </div>

      <div className="p-6 space-y-4">
        {paymentMethods.map(method => (
          <div key={method.id} className={`bg-surface-dark rounded-2xl p-4 flex items-center justify-between ${method.isDefault ? 'border border-primary/30' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-8 ${getCardColor(method.type)} rounded flex items-center justify-center text-white font-bold text-xs`}>
                {method.type}
              </div>
              <div>
                <p className="font-bold">{method.name}</p>
                {method.isDefault && <p className="text-text-secondary text-sm">기본 결제 수단</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!method.isDefault && (
                <button 
                  onClick={() => setDefaultPaymentMethod(method.id)}
                  className="text-text-secondary text-sm font-medium hover:text-primary"
                >
                  기본으로 설정
                </button>
              )}
              <button 
                onClick={() => deletePaymentMethod(method.id)}
                className="text-red-500/70 hover:text-red-500 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {showAddForm ? (
          <div className="bg-surface-dark rounded-2xl p-4 space-y-4 border border-primary/30">
            <h3 className="font-bold">새 결제 수단 추가</h3>
            <input 
              type="text" placeholder="이름 (예: 신한카드 x1234)" 
              value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full bg-bg-dark rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select 
              value={newType} onChange={e => setNewType(e.target.value as any)}
              className="w-full bg-bg-dark rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="VISA" className="bg-[#1a1a1a] text-text-primary">VISA</option>
              <option value="AMEX" className="bg-[#1a1a1a] text-text-primary">AMEX</option>
              <option value="MASTER" className="bg-[#1a1a1a] text-text-primary">MasterCard</option>
              <option value="BANK" className="bg-[#1a1a1a] text-text-primary">계좌이체</option>
            </select>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 rounded-xl bg-bg-dark font-medium">취소</button>
              <button onClick={handleAdd} className="flex-1 py-3 rounded-xl bg-primary text-bg-dark font-bold">추가</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 rounded-2xl border border-dashed border-border-dark text-text-secondary font-medium flex items-center justify-center gap-2 hover:bg-surface-dark transition-colors mt-4"
          >
            <Plus size={20} />
            새 결제 수단 추가
          </button>
        )}
      </div>
    </div>
  );
};
