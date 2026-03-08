import React, { useState, useRef } from 'react';
import { X, Utensils, Car, ShoppingBag, Receipt, Plane, PlusSquare, Dumbbell, MoreHorizontal, Delete, Wallet, Clapperboard, ShoppingCart, Coffee, Camera, Loader2 } from 'lucide-react';
import { useAppContext, TransactionType } from '../store/AppContext';
import { cn } from '../utils/cn';
import { extractAmountFromReceipt } from '../utils/ocr';

export const AddTransaction = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { addTransaction, updateTransaction, editingTransaction, setEditingTransaction, addFixedExpense, categories, paymentMethods } = useAppContext();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('c1');
  const [merchant, setMerchant] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods.find(m => m.isDefault)?.name || '');
  const [isFixed, setIsFixed] = useState(false);
  const [step, setStep] = useState<'amount' | 'details'>('amount');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill if editing
  React.useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setSelectedCategory(editingTransaction.categoryId);
      setMerchant(editingTransaction.merchant);
      setPaymentMethod(editingTransaction.paymentMethod);
      setIsFixed(editingTransaction.isFixed || false);
    }
  }, [editingTransaction]);

  // Update default category when type changes (only if not editing initially or if type changed manually)
  React.useEffect(() => {
    if (!editingTransaction || editingTransaction.type !== type) {
      const firstCat = categories.find(c => c.type === type);
      if (firstCat) {
        setSelectedCategory(firstCat.id);
      }
    }
  }, [type, categories, editingTransaction]);

  const handleNumberClick = (num: string) => {
    if (amount === '0') {
      setAmount(num);
    } else {
      setAmount(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (amount.length > 1) {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleNext = () => {
    const numAmount = parseInt(amount, 10);
    if (numAmount > 0) {
      setStep('details');
    }
  };

  const handleSave = () => {
    const numAmount = parseInt(amount, 10);
    if (numAmount > 0) {
      const txDate = editingTransaction ? editingTransaction.date : new Date().toISOString();
      
      if (editingTransaction) {
        updateTransaction(editingTransaction.id, {
          amount: numAmount,
          type: type,
          categoryId: selectedCategory,
          merchant: merchant || (type === 'expense' ? '새로운 지출' : '새로운 수입'),
          paymentMethod: paymentMethod || (type === 'expense' ? '현금' : '계좌이체'),
          isFixed,
        });
        setEditingTransaction(null);
      } else {
        addTransaction({
          amount: numAmount,
          type: type,
          categoryId: selectedCategory,
          date: txDate,
          merchant: merchant || (type === 'expense' ? '새로운 지출' : '새로운 수입'),
          paymentMethod: paymentMethod || (type === 'expense' ? '현금' : '계좌이체'),
          isFixed,
        });
      }

      if (isFixed && !editingTransaction) { // Only add fixed expense if new transaction
        addFixedExpense({
          name: merchant || (type === 'expense' ? '새로운 지출' : '새로운 수입'),
          amount: numAmount,
          dayOfMonth: new Date(txDate).getDate(),
          categoryId: selectedCategory,
        });
      }

      onNavigate('home');
    }
  };

  const handleClose = () => {
    setEditingTransaction(null);
    onNavigate('home');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const extractedAmount = await extractAmountFromReceipt(file);
      
      if (extractedAmount && extractedAmount > 0) {
        setAmount(extractedAmount.toString());
        // Optionally move to details step automatically if amount is found
        // setStep('details'); 
      } else {
        alert("영수증에서 금액을 찾을 수 없습니다.");
      }

    } catch (error) {
      console.error("Failed to analyze receipt:", error);
      alert("영수증 인식에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getIconForCategory = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return Utensils;
      case 'Car': return Car;
      case 'ShoppingBag': return ShoppingBag;
      case 'ShoppingCart': return ShoppingCart;
      case 'Receipt': return Receipt;
      case 'Plane': return Plane;
      case 'PlusSquare': return PlusSquare;
      case 'Dumbbell': return Dumbbell;
      case 'Wallet': return Wallet;
      case 'Clapperboard': return Clapperboard;
      case 'Coffee': return Coffee;
      default: return MoreHorizontal;
    }
  };

  if (step === 'details') {
    return (
      <div className="flex flex-col h-full bg-transparent">
        <div className="flex justify-between items-center p-6">
          <button onClick={() => setStep('amount')} className="p-2 -ml-2 text-text-primary">
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold">{editingTransaction ? '상세 정보 수정' : '상세 정보 입력'}</h2>
          <button onClick={handleSave} className="btn-accent font-bold px-4 py-2 rounded-full text-sm">
            {editingTransaction ? '수정하기' : '저장하기'}
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center mb-8">
            <p className="text-text-secondary text-sm mb-2">입력 금액</p>
            <p className="text-4xl font-bold text-white">{parseInt(amount, 10).toLocaleString()}원</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">사용처 (가맹점)</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="예: 스타벅스, 이마트"
                className="w-full glass text-text-primary rounded-xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-primary placeholder-text-secondary"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">결제 수단</label>
              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full glass text-text-primary rounded-xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-primary appearance-none relative z-10 bg-transparent"
                >
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.name} className="bg-[#1a0b2e] text-white">
                      {method.name}
                    </option>
                  ))}
                  <option value="현금" className="bg-[#1a0b2e] text-white">현금</option>
                  <option value="계좌이체" className="bg-[#1a0b2e] text-white">계좌이체</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                  <MoreHorizontal size={20} className="text-text-secondary" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between glass rounded-xl p-4 mt-4">
              <div>
                <p className="font-medium text-white">고정 지출로 등록</p>
                <p className="text-xs text-text-secondary">매월 같은 날짜에 고정 지출로 관리합니다.</p>
              </div>
              <button 
                onClick={() => setIsFixed(!isFixed)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${isFixed ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isFixed ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
          <Loader2 size={48} className="text-primary animate-spin mb-4" />
          <p className="text-white font-bold">영수증 분석 중...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <button onClick={handleClose} className="p-2 text-text-primary">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold">{editingTransaction ? '내역 수정' : '내역 추가'}</h2>
        <button onClick={handleNext} className="text-primary font-bold p-2">
          다음
        </button>
      </div>

      {/* Amount Display */}
      <div className="flex flex-col items-center justify-center py-2 shrink-0 bg-bg-dark z-10 relative">
        {/* Camera Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-surface-dark rounded-full text-primary hover:bg-primary/20 transition-colors"
        >
          <Camera size={24} />
        </button>

        {/* Toggle Switch */}
        <div className="flex bg-surface-dark rounded-full p-0.5 mb-2">
          <button
            onClick={() => setType('expense')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-colors",
              type === 'expense' ? "bg-white text-black" : "text-text-secondary"
            )}
          >
            지출
          </button>
          <button
            onClick={() => setType('income')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-colors",
              type === 'income' ? "bg-white text-black" : "text-text-secondary"
            )}
          >
            수입
          </button>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tighter">
            {parseInt(amount, 10).toLocaleString()}
          </span>
          <span className="text-2xl font-bold">원</span>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 flex-1 overflow-y-auto min-h-0 bg-bg-dark">
        <div className="flex justify-between items-center mb-2 sticky top-0 bg-bg-dark py-2 z-10">
          <p className="text-text-secondary text-xs">카테고리</p>
          <button 
            onClick={() => onNavigate('category_settings')}
            className="text-xs text-primary font-bold"
          >
            편집
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 pb-2">
          {categories
            .filter(c => c.type === type)
            .map((cat) => {
            const Icon = getIconForCategory(cat.icon);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl gap-1 transition-colors aspect-square",
                  isSelected ? "btn-accent" : "glass hover:bg-white/10"
                )}
              >
                <Icon size={18} />
                <span className="text-[10px] font-bold truncate w-full text-center leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Number Pad */}
      <div className="glass rounded-t-2xl p-3 pb-safe mt-auto shrink-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-3 gap-2 max-w-[300px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="text-xl font-bold h-10 glass-button rounded-xl flex items-center justify-center transition-transform active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberClick('00')}
            className="text-lg font-bold h-10 glass-button rounded-xl flex items-center justify-center transition-transform active:scale-95"
          >
            00
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="text-xl font-bold h-10 glass-button rounded-xl flex items-center justify-center transition-transform active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-10 glass-button rounded-xl flex items-center justify-center transition-transform active:scale-95 text-text-primary"
          >
            <Delete size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
