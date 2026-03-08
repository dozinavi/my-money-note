import React, { useState } from 'react';
import { ChevronLeft, Shield, Key, Smartphone, EyeOff, Lock, Bell, X } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const SecuritySettings = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { securitySettings, updateSecuritySettings } = useAppContext();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');

  const handleToggleAppLock = () => {
    if (securitySettings.appLock) {
      updateSecuritySettings({ appLock: false, pin: null });
    } else {
      setShowPinModal(true);
    }
  };

  const handleSavePin = () => {
    if (newPin.length === 4) {
      updateSecuritySettings({ appLock: true, pin: newPin });
      setShowPinModal(false);
      setNewPin('');
    } else {
      alert('4자리 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-dark">
      <div className="flex items-center p-6 pb-4 border-b border-border-dark sticky top-0 bg-bg-dark z-10">
        <button onClick={() => onNavigate('settings')} className="p-2 -ml-2 text-text-primary hover:bg-surface-dark rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">보안 및 개인정보 보호</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        <div>
          <h3 className="text-sm font-bold text-text-secondary mb-3 px-2">보안 설정</h3>
          <div className="bg-surface-dark rounded-2xl overflow-hidden">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-border-dark"
            >
              <div className="flex items-center gap-3">
                <Key size={20} className="text-text-secondary" />
                <span className="font-medium">비밀번호 변경</span>
              </div>
            </button>
            
            <div className="w-full flex items-center justify-between p-4 border-b border-border-dark">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-text-secondary" />
                <span className="font-medium">생체 인증 사용 (Face ID / 지문)</span>
              </div>
              <button 
                onClick={() => updateSecuritySettings({ biometrics: !securitySettings.biometrics })}
                className={`w-12 h-6 rounded-full transition-colors relative ${securitySettings.biometrics ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${securitySettings.biometrics ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="w-full flex items-center justify-between p-4 border-b border-border-dark">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-text-secondary" />
                <span className="font-medium">앱 잠금 (비밀번호)</span>
              </div>
              <button 
                onClick={handleToggleAppLock}
                className={`w-12 h-6 rounded-full transition-colors relative ${securitySettings.appLock ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${securitySettings.appLock ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <button 
              onClick={() => setShow2FAModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-text-secondary" />
                <span className="font-medium">2단계 인증 설정</span>
              </div>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-secondary mb-3 px-2">개인정보 관리</h3>
          <div className="bg-surface-dark rounded-2xl overflow-hidden">
            <div className="w-full flex items-center justify-between p-4 border-b border-border-dark">
              <div className="flex items-center gap-3">
                <EyeOff size={20} className="text-text-secondary" />
                <span className="font-medium">홈 화면 잔액 숨기기</span>
              </div>
              <button 
                onClick={() => updateSecuritySettings({ hideBalance: !securitySettings.hideBalance })}
                className={`w-12 h-6 rounded-full transition-colors relative ${securitySettings.hideBalance ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${securitySettings.hideBalance ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="w-full flex items-center justify-between p-4 border-b border-border-dark">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-text-secondary" />
                <span className="font-medium">마케팅 정보 수신 동의</span>
              </div>
              <button 
                onClick={() => updateSecuritySettings({ marketingConsent: !securitySettings.marketingConsent })}
                className={`w-12 h-6 rounded-full transition-colors relative ${securitySettings.marketingConsent ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${securitySettings.marketingConsent ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <button 
              onClick={() => alert('개인정보 처리방침을 불러옵니다.')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-border-dark"
            >
              <span className="font-medium">개인정보 처리방침</span>
            </button>
            <button 
              onClick={() => alert('데이터 다운로드를 시작합니다.')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-border-dark"
            >
              <span className="font-medium">데이터 다운로드</span>
            </button>
            <button 
              onClick={() => {
                if(window.confirm('정말 계정을 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) {
                  alert('계정 탈퇴가 완료되었습니다.');
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-red-500"
            >
              <span className="font-medium">계정 탈퇴</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bg-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">비밀번호 변경</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-text-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <input type="password" placeholder="현재 비밀번호" className="w-full bg-surface-dark rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-primary" />
              <input type="password" placeholder="새 비밀번호" className="w-full bg-surface-dark rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-primary" />
              <input type="password" placeholder="새 비밀번호 확인" className="w-full bg-surface-dark rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button 
              onClick={() => {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                setShowPasswordModal(false);
              }}
              className="w-full py-4 rounded-xl bg-primary text-bg-dark font-bold"
            >
              변경하기
            </button>
          </div>
        </div>
      )}

      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bg-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">2단계 인증 설정</h3>
              <button onClick={() => setShow2FAModal(false)} className="text-text-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-text-secondary mb-6">
              안전한 계정 보호를 위해 2단계 인증을 사용합니다.
            </p>
            <div className="w-full flex items-center justify-between p-4 bg-surface-dark rounded-xl mb-6">
              <span className="font-medium">2단계 인증 활성화</span>
              <button 
                onClick={() => updateSecuritySettings({ twoFactor: !securitySettings.twoFactor })}
                className={`w-12 h-6 rounded-full transition-colors relative ${securitySettings.twoFactor ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${securitySettings.twoFactor ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <button 
              onClick={() => setShow2FAModal(false)}
              className="w-full py-4 rounded-xl bg-surface-dark text-white font-bold"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bg-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">앱 잠금 비밀번호 설정</h3>
              <button onClick={() => setShowPinModal(false)} className="text-text-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-text-secondary mb-6">
              앱 실행 시 사용할 4자리 비밀번호를 입력해주세요.
            </p>
            <input 
              type="password" 
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="숫자 4자리" 
              className="w-full bg-surface-dark rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-primary text-center text-2xl tracking-[1em] mb-6" 
            />
            <button 
              onClick={handleSavePin}
              className="w-full py-4 rounded-xl bg-primary text-bg-dark font-bold"
            >
              설정 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
