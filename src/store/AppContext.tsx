import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  merchant: string;
  paymentMethod: string;
  note?: string;
  isFixed?: boolean;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  categoryId: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'VISA' | 'AMEX' | 'MASTER' | 'BANK';
  isDefault: boolean;
}

export interface SecuritySettings {
  biometrics: boolean;
  appLock: boolean;
  pin: string | null;
  hideBalance: boolean;
  twoFactor: boolean;
  marketingConsent: boolean;
}

interface AppState {
  balance: number;
  budget: number;
  transactions: Transaction[];
  categories: Category[];
  fixedExpenses: FixedExpense[];
  userProfile: UserProfile;
  paymentMethods: PaymentMethod[];
  securitySettings: SecuritySettings;
  isLocked: boolean;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  addFixedExpense: (expense: Omit<FixedExpense, 'id'>) => void;
  updateFixedExpense: (id: string, expense: Partial<FixedExpense>) => void;
  setBalance: (amount: number) => void;
  setBudget: (amount: number) => void;
  updateUserProfile: (profile: UserProfile) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  unlockApp: (pin?: string) => boolean;
  lockApp: () => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;
}

const defaultCategories: Category[] = [
  { id: 'c1', name: '식비', icon: 'Utensils', color: 'bg-green-500 text-white', type: 'expense' },
  { id: 'c2', name: '교통', icon: 'Car', color: 'bg-blue-500 text-white', type: 'expense' },
  { id: 'c3', name: '쇼핑', icon: 'ShoppingBag', color: 'bg-purple-500 text-white', type: 'expense' },
  { id: 'c4', name: '공과금', icon: 'Receipt', color: 'bg-yellow-500 text-white', type: 'expense' },
  { id: 'c5', name: '여행', icon: 'Plane', color: 'bg-indigo-500 text-white', type: 'expense' },
  { id: 'c6', name: '의료', icon: 'PlusSquare', color: 'bg-red-500 text-white', type: 'expense' },
  { id: 'c7', name: '운동', icon: 'Dumbbell', color: 'bg-orange-500 text-white', type: 'expense' },
  { id: 'c8', name: '기타', icon: 'MoreHorizontal', color: 'bg-gray-500 text-white', type: 'expense' },
  { id: 'c10', name: '엔터테인먼트', icon: 'Clapperboard', color: 'bg-fuchsia-500 text-white', type: 'expense' },
  // Income categories
  { id: 'c9', name: '급여', icon: 'Wallet', color: 'bg-emerald-500 text-white', type: 'income' },
  { id: 'c11', name: '용돈', icon: 'Wallet', color: 'bg-teal-500 text-white', type: 'income' },
  { id: 'c12', name: '기타수입', icon: 'PlusSquare', color: 'bg-cyan-500 text-white', type: 'income' },
];

const initialTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 84500,
    type: 'expense',
    categoryId: 'c1',
    date: new Date().toISOString(),
    merchant: '홀푸드',
    paymentMethod: '식료품',
  },
  {
    id: 't2',
    amount: 15200,
    type: 'expense',
    categoryId: 'c2',
    date: new Date().toISOString(),
    merchant: '우버',
    paymentMethod: '교통',
  },
];

const initialFixedExpenses: FixedExpense[] = [
  { id: 'f1', name: '월세', amount: 500000, dayOfMonth: 1, categoryId: 'c2' },
  { id: 'f2', name: '인터넷/TV', amount: 35000, dayOfMonth: 15, categoryId: 'c4' },
  { id: 'f3', name: '넷플릭스', amount: 17000, dayOfMonth: 23, categoryId: 'c10' },
];

const initialPaymentMethods: PaymentMethod[] = [
  { id: 'p1', name: 'Visa x1234', type: 'VISA', isDefault: true },
  { id: 'p2', name: 'Amex x9876', type: 'AMEX', isDefault: false },
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(() => {
    const saved = localStorage.getItem('fixedExpenses');
    return saved ? JSON.parse(saved) : initialFixedExpenses;
  });
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('balance');
    return saved ? JSON.parse(saved) : 4520000;
  });
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? JSON.parse(saved) : 3000000;
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: 'Alex', email: 'alex@example.com', phone: '010-1234-5678' };
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('paymentMethods');
    return saved ? JSON.parse(saved) : initialPaymentMethods;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('securitySettings');
    return saved ? JSON.parse(saved) : {
      biometrics: true,
      appLock: false,
      pin: null,
      hideBalance: false,
      twoFactor: false,
      marketingConsent: false,
    };
  });

  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (securitySettings.appLock) {
      setIsLocked(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses));
  }, [fixedExpenses]);

  useEffect(() => {
    localStorage.setItem('balance', JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
  }, [securitySettings]);

  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => ({ ...prev, ...settings }));
  };

  const unlockApp = (pin?: string) => {
    if (securitySettings.biometrics && !pin) {
      setIsLocked(false);
      return true;
    }
    if (pin && pin === securitySettings.pin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (securitySettings.appLock) {
      setIsLocked(true);
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions((prev) => [newTx, ...prev]);
    if (tx.type === 'expense') {
      setBalance((prev: number) => prev - tx.amount);
    } else {
      setBalance((prev: number) => prev + tx.amount);
    }
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      if (tx.type === 'expense') {
        setBalance(prev => prev + tx.amount);
      } else {
        setBalance(prev => prev - tx.amount);
      }
    }
  };

  const updateTransaction = (id: string, updatedTx: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const oldAmount = t.amount;
        const oldType = t.type;
        const newAmount = updatedTx.amount ?? oldAmount;
        const newType = updatedTx.type ?? oldType;
        
        // Revert balance change from old transaction
        if (oldType === 'expense') {
          setBalance(b => b + oldAmount);
        } else {
          setBalance(b => b - oldAmount);
        }

        // Apply balance change for new transaction
        if (newType === 'expense') {
          setBalance(b => b - newAmount);
        } else {
          setBalance(b => b + newAmount);
        }

        return { ...t, ...updatedTx };
      }
      return t;
    }));
  };

  const addFixedExpense = (expense: Omit<FixedExpense, 'id'>) => {
    setFixedExpenses((prev) => [
      ...prev,
      { ...expense, id: Math.random().toString(36).substr(2, 9) }
    ]);
  };

  const deleteFixedExpense = (id: string) => {
    setFixedExpenses((prev) => prev.filter(e => e.id !== id));
  };

  const updateFixedExpense = (id: string, expense: Partial<FixedExpense>) => {
    setFixedExpenses((prev) => prev.map(e => e.id === id ? { ...e, ...expense } : e));
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod = { ...method, id: Math.random().toString(36).substr(2, 9) };
    if (newMethod.isDefault) {
      setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: false })).concat(newMethod));
    } else {
      setPaymentMethods(prev => [...prev, newMethod]);
    }
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(m => ({
      ...m,
      isDefault: m.id === id
    })));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9) };
    setCategories(prev => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...category } : c));
  };

  return (
    <AppContext.Provider
      value={{
        balance,
        budget,
        transactions,
        categories,
        fixedExpenses,
        userProfile,
        paymentMethods,
        securitySettings,
        isLocked,
        addTransaction,
        addFixedExpense,
        deleteFixedExpense,
        updateFixedExpense,
        setBalance,
        setBudget,
        updateUserProfile,
        addPaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod,
        updateSecuritySettings,
        unlockApp,
        lockApp,
        addCategory,
        deleteCategory,
        updateCategory,
        deleteTransaction,
        updateTransaction,
        editingTransaction,
        setEditingTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
