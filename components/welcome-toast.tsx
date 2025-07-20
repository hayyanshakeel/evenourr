'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3000); // Hide after 3 seconds
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div className="fixed bottom-5 right-5 rounded-md bg-black p-4 text-white shadow-lg">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
