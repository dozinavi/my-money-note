import React, { useState, useRef } from 'react';
import { ChevronLeft, User, Mail, Phone, Camera } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const ProfileSettings = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { userProfile, updateUserProfile } = useAppContext();
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [profileImage, setProfileImage] = useState(userProfile.profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateUserProfile({ name, email, phone, profileImage });
    onNavigate('settings');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-bg-dark">
      <div className="flex items-center p-6 pb-4 border-b border-border-dark sticky top-0 bg-bg-dark z-10">
        <button onClick={() => onNavigate('settings')} className="p-2 -ml-2 text-text-primary hover:bg-surface-dark rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">개인 정보</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div 
            onClick={triggerFileInput}
            className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-bg-dark font-bold text-4xl mb-4 cursor-pointer relative overflow-hidden group"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button onClick={triggerFileInput} className="text-primary font-medium text-sm">사진 변경</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">이름</label>
            <div className="flex items-center bg-surface-dark rounded-xl px-4 py-3">
              <User size={20} className="text-text-secondary mr-3" />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent flex-1 text-text-primary focus:outline-none" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">이메일</label>
            <div className="flex items-center bg-surface-dark rounded-xl px-4 py-3">
              <Mail size={20} className="text-text-secondary mr-3" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 text-text-primary focus:outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">전화번호</label>
            <div className="flex items-center bg-surface-dark rounded-xl px-4 py-3">
              <Phone size={20} className="text-text-secondary mr-3" />
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent flex-1 text-text-primary focus:outline-none" 
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold mt-8"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};
