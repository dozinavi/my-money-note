import React, { useState, useEffect } from 'react';
import { Fingerprint, Delete } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const LockScreen = () => {
  const { securitySettings, unlockApp } = useAppContext();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (securitySettings.biometrics) {
      // Simulate biometric prompt on mount
      setTimeout(() => {
        if (window.confirm('생체 인증(Face ID / 지문)으로 잠금을 해제하시겠습니까?')) {
          unlockApp();
        }
      }, 500);
    }
  }, [securitySettings.biometrics, unlockApp]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        const success = unlockApp(newPin);
        if (!success) {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg-dark flex flex-col items-center justify-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-8">
          <Fingerprint size={32} className="text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">앱 잠금 해제</h2>
        <p className="text-text-secondary mb-8">
          {error ? (
            <span className="text-red-500">비밀번호가 일치하지 않습니다.</span>
          ) : (
            '비밀번호 4자리를 입력해주세요.'
          )}
        </p>

        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-colors ${
                i < pin.length ? 'bg-primary' : 'bg-surface-dark border border-border-dark'
              }`} 
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-medium hover:bg-surface-dark transition-colors mx-auto"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick('0')}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-medium hover:bg-surface-dark transition-colors mx-auto"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-medium hover:bg-surface-dark transition-colors mx-auto text-text-secondary"
          >
            <Delete size={24} />
          </button>
        </div>
        
        {securitySettings.biometrics && (
          <button 
            onClick={() => unlockApp()}
            className="mt-12 text-primary font-medium flex items-center gap-2"
          >
            <Fingerprint size={20} />
            생체 인증으로 해제
          </button>
        )}
      </div>
    </div>
  );
};
